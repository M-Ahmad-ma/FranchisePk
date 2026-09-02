import React from 'react';
import {
  ImageBackground,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Image
} from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import bgImage from '../../../../assets/bgImage.jpg';
import MultiStepFilter, { Filters, FilterOption } from '../components/MultiStepFilter';
import { useHome } from '../../../shared/hooks/useHome';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { InvestorTabParamList } from '../../../shared/types/navigation';
import Card from '../../home/components/Card';
import { catImageUrl, imageUrl } from '../../../shared/api/imageUrl';
import { ChevronRight, ImageOff } from 'lucide-react-native';
import { TestimonialsSection } from '../../home/components/TestimonialsSection';
import { Skeleton } from '../../../shared/components/Skeleton';

function HomeV2() {
  const { width } = useWindowDimensions();
  const numColumns = width < 640 ? 3 : 3; // responsive columns
  const navigation = useNavigation<BottomTabNavigationProp<InvestorTabParamList>>();

  const homeQuery = useHome();

  const categories = homeQuery?.data?.categories || [];
  const featuredCompanies = homeQuery?.data?.featured || []
  const featuredArray = Object.values(featuredCompanies || {});
  const testimonials = homeQuery?.data?.testimonials || [];

  // Filter options sourced from the home API
  const industries: FilterOption[] = categories.map((c) => ({
    id: c.c_id,
    label: c.c_name,
  }));
  const states: FilterOption[] = (homeQuery?.data?.cities || []).map((c: any) => ({
    id: c.co_city ?? c.name ?? c.id,
    label: c.co_city ?? c.name ?? String(c.id),
  }));
  const investments: FilterOption[] = (homeQuery?.data?.ranges || []).map((r: any) => ({
    id: r.co_total_investment,
    label: r.co_total_investment,
  }));

  const handleSearch = (filters: Filters) => {
    navigation.navigate('FranchiseDirectory', {
      screen: 'FranchiseList',
      params: {
        cat: filters.industry?.id ? String(filters.industry.id) : undefined,
        range: filters.investment?.id ? String(filters.investment.id) : undefined,
        city: filters.state?.id ? String(filters.state.id) : undefined,
      },
    });
  };



  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="flex-1 m-1 p-3 bg-transparent rounded-lg  "
      activeOpacity={0.7}
      onPress={() => navigation.navigate("FranchiseDirectory", {
        screen: "FranchiseList",
        params: { filter: item.c_slug }
      })}
    >
      {item.c_image ? (
        <View className='flex items-center justify-center'>
          <Image className='w-12 h-12' resizeMode='contain' source={{ uri: catImageUrl(item.c_image) }} />
        </View>
      ) : (
        <View className='w-full flex items-center justify-center h-20 bg-neutral-300 rounded-xl'>
          <ImageOff color='gray' />
        </View>
      )}
      <Text className="font-lato-bold text-sm text-black text-center">
        {item.c_name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <MainLayout showHeader={true}>
      <ScrollView>

        <ImageBackground
          source={bgImage}
          resizeMode="cover"
          className="w-full py-5 justify-end pb-2"
        >
          <View className="flex items-center mb-4 px-4">
            <Text className="font-lato-bold text-white text-3xl text-center">
              Industry of Opportunity
            </Text>
            <Text className="font-normal text-center text-sm text-white">
              Your most comprehensive resource for finding a franchise opportunity.
            </Text>
          </View>
          <MultiStepFilter
            industries={industries}
            states={states}
            investments={investments}
            onSearch={handleSearch}
          />
        </ImageBackground>

        {/* Categories Grid */}
        <View className="px-2 py-4 bg-transparent">
          {homeQuery.isLoading ? (
            <View className="flex-row flex-wrap">
              {Array.from({ length: numColumns * 2 }).map((_, i) => (
                <View
                  key={i}
                  className="p-3 m-1 border border-neutral-200 rounded-lg"
                  style={{ width: `100%` }}
                >
                  <Skeleton className="w-full h-20 rounded-xl mb-2" />
                  <Skeleton className="w-3/4 h-4 mx-auto" />
                </View>
              ))}
            </View>
          ) : (
            <FlatList
              data={categories}
              key={numColumns} // forces re-render on width change
              keyExtractor={(item) => item.c_id.toString()}
              renderItem={renderCategoryItem}
              numColumns={numColumns}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>

        <View>
          <View className='flex items-center justify-between flex-row'>
            <Text className='text-xl font-lato-bold ml-5'>Featured Opportunities</Text>
            <TouchableOpacity className='flex items-center gap-1 flex-row mr-4'
              onPress={() => navigation.navigate("FranchiseDirectory", { screen: "FranchiseList" })}
            >
              <Text className='text-primary-800'>view all</Text>
              <ChevronRight color='#386092' size={18} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className='px-3'>
            {homeQuery.isLoading ? (
              [0, 1, 2].map((i) => (
                <View key={i} className="w-[260px] h-[150px] mx-2 my-2 rounded-2xl">
                  <Skeleton className="w-full h-full rounded-2xl" />
                </View>
              ))
            ) : (
              featuredArray.map(item => {
                const imageName = item.company_images?.[0]?.img_name;

                return (
                  <Card
                    key={item.co_id}
                    title={item.co_name}
                    containerClassName="w-[260px] h-[150px]"
                    imageSource={
                      imageName
                        ? { uri: imageUrl(imageName) }
                        : undefined
                    }
                    onPress={() =>
                      navigation.navigate('FranchiseDirectory', {
                        screen: 'CompanyDetail',
                        params: { slug: item.co_slug },
                      })
                    }
                  />
                )
              })
            )}
          </ScrollView>
        </View>

        <TestimonialsSection
          testimonials={testimonials}
          isLoading={homeQuery.isLoading}
        />
      </ScrollView>
    </MainLayout>
  );
}

export default HomeV2;
