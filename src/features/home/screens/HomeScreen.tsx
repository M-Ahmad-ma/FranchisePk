import { ScrollView, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useState } from 'react';
import Carousel from '../components/Carousal';
import ChipList from '../../../shared/components/ChipList';
import Card from "../components/Card"
import Button from "../../../shared/components/Button"
import { ChevronRight, Building2, Store, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { InvestorTabParamList } from '../../../shared/types/navigation';
import { useHome } from '../../../shared/hooks/useHome';
import { useInternationalCompanies } from '../../../shared/hooks/useCompanies';
import { imageUrl } from '../../../shared/api/imageUrl';
import { Log } from '../../../shared/utils/Log';
import { Screen } from 'react-native-screens';
import { Skeleton } from '../../../shared/components/Skeleton';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { INTERNATIONAL_SLUG } from '../../../shared/utils/franchise';

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

          <View className="px-4 mt-3">
            <View className="flex-row gap-3" >
              <TouchableOpacity
                style={{ shadowColor: "#000", elevation: 3 }}
                onPress={() => navigation.navigate('Properties', { screen: 'PropertiesList' })}
                className="w-1/2 bg-white rounded-2xl border border-neutral-100 p-3.5"
                activeOpacity={0.85}
              >
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-2.5 bg-secondary-200">
                  <Building2 size={18} color="#2151DA" />
                </View>
                <Text className="text-neutral-700 font-lato-bold text-[13px]">Property</Text>
                <Text className="text-neutral-500 font-lato text-[11px] mt-0.5">Available listings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ shadowColor: "#000", elevation: 3 }}
                onPress={() => navigation.navigate('FranchiseDirectory', { screen: 'FranchiseList' })}
                className="w-1/2 bg-white rounded-2xl border border-neutral-100 p-3.5"
                activeOpacity={0.85}
              >
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-2.5 bg-tertiary-200">
                  <Store size={18} color="#00A572" />
                </View>
                <Text className="text-neutral-700 font-lato-bold text-[13px]">Companies</Text>
                <Text className="text-neutral-500 font-lato text-[11px] mt-0.5">Featured franchises</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2: third item full width */}
            <View className="mt-3 flex items-center justify-center">
              <TouchableOpacity
                style={{ shadowColor: "#000", elevation: 3 }}
                onPress={() => navigation.navigate('FranchiseDirectory', { screen: 'FranchiseList' })}
                className="w-[60%] bg-white rounded-2xl border border-neutral-100 p-3.5"
                activeOpacity={0.85}
              >
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-2.5 bg-[#FDEAF5]">
                  <Globe size={18} color="#E0409A" />
                </View>
                <Text className="text-neutral-700 font-lato-bold text-[13px]">International</Text>
                <Text className="text-neutral-500 font-lato text-[11px] mt-0.5">Global brands</Text>
              </TouchableOpacity>
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
                <Text className="text-neutral-900 text-2xl font-lato-bold mt-5 ml-2">
                  Featured Opportunities
                </Text>
                <Text className='ml-2 font-lato text-neutral-600 text-sm'>
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

                Log("company Image", imageName)

                return (
                  <Card
                    key={item.co_id}
                    onPress={() =>
                      navigation.navigate('FranchiseDirectory', {
                        screen: 'CompanyDetail',
                        params: { slug: item.co_slug },
                      })
                    }
                    containerClassName="w-[270px]"
                    imageSource={
                      imageName
                        ? { uri: imageUrl(imageName) }
                        : undefined
                    }
                    title={item.co_name}
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
              <Text className="text-neutral-900 text-2xl font-lato-bold mb-3 ml-3">
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
                      containerClassName='w-[280px]'
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
              <Text className="text-neutral-900 text-2xl font-lato-bold mb-3 ml-3">
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
                      description={item?.pMessage}
                      containerClassName='w-[280px]'
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
