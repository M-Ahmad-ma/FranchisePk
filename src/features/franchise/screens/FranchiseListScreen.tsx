import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { FranchiseStackParamList } from '../../../shared/types/navigation';
import { useEffect, useState } from 'react';
import Card from '../../home/components/Card';
import ChipList from '../../../shared/components/ChipList';
import { useCompanyDirectory } from '../../../shared/hooks/useCompanies';
import { Skeleton } from '../../../shared/components/Skeleton';
import {
  buildCategoryChips,
  paginate,
  hasMore,
  getCompanyCoverImage,
  ALL_SECTORS,
} from '../../../shared/utils/franchise';

const PAGE_SIZE = 8;

export function FranchiseListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FranchiseStackParamList>>();
  const route = useRoute<RouteProp<FranchiseStackParamList, 'FranchiseList'>>();
  const [selected, setSelected] = useState(route.params?.filter ?? ALL_SECTORS);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data, isLoading, isError } = useCompanyDirectory(selected);

  useEffect(() => {
    const filter = route.params?.filter ?? ALL_SECTORS;
    if (filter !== selected) {
      setSelected(filter);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.filter]);

  const companies = data?.companies ?? [];
  const chips = buildCategoryChips(data?.categories ?? []);
  const visibleCompanies = paginate(companies, page, PAGE_SIZE);
  const hasMoreItems = hasMore(companies, page, PAGE_SIZE);

  useEffect(() => {
    setIsLoadingMore(false);
  }, [page]);

  const onSelectChip = (chip: { id: string; label: string }) => {
    setSelected(chip.id);
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
        renderItem={({ item }) => (
          <Card
            title={item.co_name}
            description={item.co_descp}
            investmentRange={item.co_investment_range}
            imageSource={getCompanyCoverImage(item)}
            onPress={() =>
              navigation.navigate('CompanyDetail', { slug: item.co_slug })
            }
          />
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
            <View className="items-center py-6">
              <ActivityIndicator color="#436CF5" />
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </MainLayout>
  );
}
