import { FlatList, Text, View, useWindowDimensions } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { FranchiseStackParamList } from '../../../shared/types/navigation';
import { useEffect, useState } from 'react';
import Card from '../../home/components/Card';
import ChipList, { ChipItem } from '../../../shared/components/ChipList';
import { useCompanyDirectory, useFilteredCompanies } from '../../../shared/hooks/useCompanies';
import { Skeleton } from '../../../shared/components/Skeleton';
import {
  buildCategoryChips,
  paginate,
  hasMore,
  getCompanyCoverImage,
  ALL_SECTORS,
} from '../../../shared/utils/franchise';
import { Log } from '../../../shared/utils/Log';

const PAGE_SIZE = 8;
const NUM_COLUMNS = 2;
const CARD_GAP = 0.2;
const H_PADDING = 2;

export function FranchiseListScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
  const navigation =
    useNavigation<NativeStackNavigationProp<FranchiseStackParamList>>();
  const route = useRoute<RouteProp<FranchiseStackParamList, 'FranchiseList'>>();
  const { filter, cat, range, city } = route.params ?? {};
  const hasAdvancedFilter = Boolean(cat || range || city);
  const [selected, setSelected] = useState(filter ?? ALL_SECTORS);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const directoryQuery = useCompanyDirectory(selected);
  const filterQuery = useFilteredCompanies(
    hasAdvancedFilter ? { cat, range, city } : undefined,
  );
  const { data, isLoading, isError } = hasAdvancedFilter
    ? filterQuery
    : directoryQuery;

  useEffect(() => {
    if (!hasAdvancedFilter && filter && filter !== selected) {
      setSelected(filter);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const companies = data?.companies ?? [];

  Log("companies", companies)
  Log("filter", selected)
  const chips: ChipItem[] = [
    {
      c_id: '1',
      c_slug: ALL_SECTORS,
      c_name: 'All',
    },
    ...(data?.categories ?? []),
  ];
  const visibleCompanies = paginate(companies, page, PAGE_SIZE);

  Log("visibleCompanies", visibleCompanies)
  const hasMoreItems = hasMore(companies, page, PAGE_SIZE);

  useEffect(() => {
    setIsLoadingMore(false);
  }, [page]);

  const onSelectChip = (chip: ChipItem) => {
    setSelected(chip.c_slug);
    setPage(1);
  };

  const loadMore = () => {
    if (!hasMoreItems || isLoadingMore) return;
    setIsLoadingMore(true);
    setPage((p) => p + 1);
  };

  return (
    <MainLayout>
      <FlatList
        className="flex-1"
        data={visibleCompanies}
        keyExtractor={(item) => item.co_id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={{ gap: CARD_GAP }}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <Card
              title={item.co_name}
              description={item.co_descp}
              investmentRange={item.co_investment_range}
              imageSource={getCompanyCoverImage(item)}
              containerClassName="h-[150px]"
              onPress={() =>
                navigation.navigate('CompanyDetail', { slug: item.co_slug })
              }
            />
          </View>
        )}
        ListHeaderComponent={
          <View className="px-4 pt-4">
            <ChipList
              items={chips}
              selectedId={selected}
              onSelect={onSelectChip}
              containerClassName="gap-2 py-2"
            />
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="mt-2">
              {[0, 1, 2].map((i) => (
                <View key={i} className="bg-white rounded-xl mx-2 my-2 overflow-hidden">
                  <Skeleton className="w-full h-44 rounded-xl" />
                  <View className="px-4 pb-4 pt-2">
                    <Skeleton className="w-2/3 h-6 mb-2" />
                    <Skeleton className="w-1/3 h-5 mb-2" />
                    <Skeleton className="w-full h-3.5 mb-1" />
                    <Skeleton className="w-5/6 h-3.5" />
                  </View>
                </View>
              ))}
            </View>
          ) : isError ? (
            <View className="items-center py-20">
              <Text className="text-neutral-500">Unable to load companies.</Text>
            </View>
          ) : (
            <View className="items-center py-20">
              <Text className="text-neutral-500">No companies found.</Text>
            </View>
          )
        }
        ListFooterComponent={
          isLoadingMore && hasMoreItems ? (
            <View className="mt-2">
              {[0, 1].map((i) => (
                <View key={i} className="bg-white rounded-xl mx-2 my-2 overflow-hidden">
                  <Skeleton className="w-full h-44 rounded-xl" />
                  <View className="px-4 pb-4 pt-2">
                    <Skeleton className="w-2/3 h-6 mb-2" />
                    <Skeleton className="w-1/3 h-5 mb-2" />
                    <Skeleton className="w-full h-3.5 mb-1" />
                    <Skeleton className="w-5/6 h-3.5" />
                  </View>
                </View>
              ))}
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: H_PADDING }}
      />
    </MainLayout>
  );
}
