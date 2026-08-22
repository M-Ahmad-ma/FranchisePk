import { ScrollView, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useState } from 'react';
import Carousel from '../components/Carousal';
import ChipList from '../../../shared/components/ChipList';
import Card from "../components/Card"
import Button from "../../../shared/components/Button"
import { ChevronRight, Building2, Store, Globe, Handshake, Home, Earth } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { InvestorTabParamList, RootStackParamList } from '../../../shared/types/navigation';
import { useHome } from '../../../shared/hooks/useHome';
import { useInternationalCompanies } from '../../../shared/hooks/useCompanies';
import { imageUrl } from '../../../shared/api/imageUrl';
import { Log } from '../../../shared/utils/Log';
import { Screen, screensEnabled } from 'react-native-screens';
import { Skeleton } from '../../../shared/components/Skeleton';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { INTERNATIONAL_SLUG } from '../../../shared/utils/franchise';
import QuickAction from '../../franchise/components/QuickAction';

export function HomeScreen() {


  const navigation = useNavigation<BottomTabNavigationProp<InvestorTabParamList>>();

  const homeQuery = useHome();
  const intlQuery = useInternationalCompanies();

  const featuredCompanies = homeQuery.data?.featured
    ? Object.values(homeQuery.data.featured)
    : [];

  const internationalCompanies = intlQuery.data?.companies || [];
  const featuredProperties = homeQuery.data?.property || [];
  const testimonials = homeQuery.data?.testimonials || [];

  // TODO remove it later 
  Log("homeQuery", homeQuery)
  Log("featured companies", featuredCompanies)
  Log("property", featuredProperties[0]?.pMessage)
  Log("testimonials", testimonials)

  const adverts = homeQuery.data?.adverts;
  const advertsImages: { uri: string }[] = (adverts ?? [])
    .map((item) => imageUrl(item?.a_img))
    .filter((u): u is string => Boolean(u))
    .map((uri) => ({ uri }));

  const advertSlug = (index: number): string | null => {
    const advert = adverts?.[index];
    const description = advert?.a_description;
    if (typeof description === 'string') {
      const match = description.match(/\/company\/([a-z0-9_-]+)/i);
      if (match) return match[1];
    }
    return null;
  };

  const goToRoleSelection = () => {
    const rootNav = navigation.getParent()?.getParent<NativeStackNavigationProp<RootStackParamList>>();
    rootNav?.navigate('Auth', { screen: 'Signup' });
  };


  return (
    <MainLayout>
      <ScrollView className="flex-1 bg-light" showsVerticalScrollIndicator={false}>
        <View>
          <View className='relative'>
            <Carousel
              images={advertsImages}
              autoPlay={true}
              height={200}
              showDots={true}
              className='mb-3'
              interval={4000}
              cardShadow={false}
              dotColor='bg-neutral-300'
              activeDotColor='bg-primary-700'
              onItemPress={(index) => {
                const slug = advertSlug(index);
                if (slug) {
                  navigation.navigate('FranchiseDirectory', {
                    screen: 'CompanyDetail',
                    params: { slug },
                  });
                }
              }}
            />
          </View>


          <View className="px-2 mt-3">
            <View className="flex-row w-full flex-wrap -mx-1.5">
              <View className="w-1/2 px-1 mb-1">
                <QuickAction
                  icon={<Home />}
                  title="Property"
                  description="Explore property"
                  containerClassName="w-full bg-primary-300"
                  bgcolor=""
                  onPress={() =>
                    navigation.navigate("Properties", {
                      screen: "PropertiesList",
                    })
                  }
                />
              </View>

              <View className="w-1/2 px-1 mb-1">
                <QuickAction
                  icon={<Building2 />}
                  title="Companies"
                  description="Explore trusted franchise brands"
                  containerClassName="w-full bg-secondary-300"
                  onPress={() =>
                    navigation.navigate("FranchiseDirectory", {
                      screen: "FranchiseList",
                    })
                  }
                />
              </View>

              <View className="w-1/2 px-1 mb-1">
                <QuickAction
                  icon={<Earth />}
                  title="International"
                  description="Discover global franchise opportunities"
                  containerClassName="w-full bg-tertiary-300"
                  onPress={() => console.log("Companies pressed")}
                />
              </View>

              <View className="w-1/2 px-1 mb-1">
                <QuickAction
                  icon={<Store />}
                  title="Become a Franchise"
                  description="Start your journey as a franchise partner"
                  containerClassName="w-full bg-neutral-400"
                  onPress={() =>
                    navigation.navigate("Auth", {
                      screen: "Signup",
                    })
                  }
                />
              </View>
            </View>
          </View>

          <View className='pl-4'>
            {/* <ChipList */}
            {/*   items={sectorChips} */}
            {/*   selectedId={selectedId} */}
            {/*   onSelect={(item) => setSelectedId(item.id)} */}
            {/* /> */}

            <View className='flex flex-row items-end justify-between'>
              <View>
                <Text className="text-neutral-900 text-[22px] leading-[26px] font-lato-black mt-5 ml-2">
                  Featured Opportunities
                </Text>
                <Text className='ml-2 font-lato text-neutral-600 text-[13px] mt-1'>
                  Curated based on investor profile
                </Text>
              </View>
              <Button
                onPress={() => navigation.navigate('FranchiseDirectory', { screen: 'FranchiseList' })}
                variant='link' title='view all' icon={<ChevronRight size={15} color='#5279AC' />} iconPosition='right'
              />
            </View>

            {homeQuery.isLoading && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                {[0, 1, 2].map((i) => (
                  <View key={i} className="w-[270px] mx-2 my-2">
                    <Skeleton className="w-full h-44 rounded-xl" />
                    <View className="px-4 pb-4 pt-2">
                      <Skeleton className="w-3/4 h-6 mb-2" />
                      <Skeleton className="w-1/2 h-5" />
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <ScrollView
              contentContainerStyle={{ alignItems: 'center' }}
              className="mb-8"
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {featuredCompanies.map((item) => {
                const imageName = item.company_images?.[0]?.img_name


                return (
                  <Card
                    key={item.co_id}
                    onPress={() =>
                      navigation.navigate('FranchiseDirectory', {
                        screen: 'CompanyDetail',
                        params: { slug: item.co_slug },
                      })
                    }
                    containerClassName="w-[260px] h-[150px]"
                    title={item.co_name}
                    imageSource={
                      imageName
                        ? { uri: imageUrl(imageName) }
                        : undefined
                    }
                    // title={item.co_name}
                    investmentRange={item.co_investment_range}
                  />
                )
              })}
              {featuredCompanies.length === 0 && !homeQuery.isLoading && (
                <View className="w-[270px] h-40 items-center justify-center">
                  <Text className="text-neutral-400">No featured franchises</Text>
                </View>
              )}
            </ScrollView>

            <View className='flex items-center flex-row justify-between'>
              <Text className="text-neutral-900 text-[22px] leading-[26px] font-lato-black mb-3 ml-3">
                International Franchises
              </Text>
              <Button
                variant='link' title='view all'
                icon={<ChevronRight size={15} color='#5279AC' />}
                iconPosition='right'
                onPress={() =>
                  navigation.navigate('FranchiseDirectory', {
                    screen: 'FranchiseList',
                    params: { filter: INTERNATIONAL_SLUG },
                  })
                }
              />
            </View>

            <View className="mb-8">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {intlQuery.isLoading && (
                  <>
                    {[0, 1].map((i) => (
                      <View key={i} className="w-[280px] mx-2 my-2">
                        <Skeleton className="w-full h-44 rounded-xl" />
                        <View className="px-4 pb-4 pt-2">
                          <Skeleton className="w-3/4 h-6 mb-2" />
                          <Skeleton className="w-full h-3.5 mb-1" />
                          <Skeleton className="w-1/2 h-3.5 mb-2" />
                          <Skeleton className="w-1/2 h-5" />
                        </View>
                      </View>
                    ))}
                  </>
                )}
                {internationalCompanies.map((item) => {
                  const image = item.company_images?.[0]?.img_name
                  return (

                    <Card
                      key={item.co_id}
                      title={item.co_name}
                      imageSource={imageUrl(image) ? { uri: imageUrl(image)! } : undefined}
                      description={item.co_descp}
                      investmentRange={item.co_investment_range}
                      containerClassName='w-[260px] h-[150px]'
                      onPress={() =>
                        navigation.navigate('FranchiseDirectory', {
                          screen: 'CompanyDetail',
                          params: { slug: item.co_slug },
                        })
                      }
                    />
                  )
                })}
              </ScrollView>
            </View>


            <View className='flex items-center flex-row justify-between'>
              <Text className="text-neutral-900 text-[22px] leading-[26px] font-lato-black mb-3 ml-3">
                Featured Malls
              </Text>
              <Button
                variant='link' title='view all'
                icon={<ChevronRight size={15} color='#5279AC' />}
                iconPosition='right'
                onPress={() => navigation.navigate("Properties")}
              />
            </View>


            <View className="mb-8">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {intlQuery.isLoading && (
                  <>
                    {[0, 1].map((i) => (
                      <View key={i} className="w-[280px] mx-2 my-2">
                        <Skeleton className="w-full h-44 rounded-xl" />
                        <View className="px-4 pb-4 pt-2">
                          <Skeleton className="w-3/4 h-6 mb-2" />
                          <Skeleton className="w-full h-3.5 mb-1" />
                          <Skeleton className="w-1/2 h-3.5 mb-2" />
                          <Skeleton className="w-1/2 h-5" />
                        </View>
                      </View>
                    ))}
                  </>
                )}
                {featuredProperties.map((item) => {
                  return (
                    <Card
                      key={item.p_id}
                      title={item.pName}
                      imageSource={imageUrl(item.pimage) ? { uri: imageUrl(item.pimage)! } : undefined}
                      containerClassName='w-[280px] h-[190px]'
                      onPress={() =>
                        navigation.navigate('Properties', {
                          screen: 'PropertyDetail',
                          params: { id: item.p_id },
                        })
                      }
                    />
                  )
                })}
              </ScrollView>
            </View>
          </View>

          <TestimonialsSection
            testimonials={testimonials}
            isLoading={homeQuery.isLoading}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
}
