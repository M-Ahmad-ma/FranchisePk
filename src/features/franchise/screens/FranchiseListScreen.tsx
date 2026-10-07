import {
  FlatList,
  Text,
  View,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { FranchiseStackParamList } from '../../../shared/types/navigation';
import { useEffect, useState } from 'react';
import Card from '../../home/components/Card';
import ChipList, { ChipItem } from '../../../shared/components/ChipList';
import Search from '../../../shared/components/Search';
import {
  useCompanyDirectory,
  useCompanies,
  useFilteredCompanies,
} from '../../../shared/hooks/useCompanies';
import { Skeleton } from '../../../shared/components/Skeleton';
import {
  paginate,
  hasMore,
  getCompanyCoverImage,
  ALL_SECTORS,
} from '../../../shared/utils/franchise';
import { Log } from '../../../shared/utils/Log';
import { useRefresh } from '../../../shared/hooks/useRefresh';
import { ErrorRetry } from '../../../shared/components/ErrorRetry';
import UserAvatar from '../../../shared/components/UserAvatar';

const PAGE_SIZE = 8;
const NUM_COLUMNS = 2;
const CARD_GAP = 0.2;
const H_PADDING = 2;
/** Long enough to avoid a request per keystroke, short enough to feel live. */
const SEARCH_DEBOUNCE_MS = 350;

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
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  // Search takes precedence: while a query is active the category chips are
  // hidden, so mixing the two would be ambiguous. Clearing the query returns
  // to whichever source the screen was already using.
  const isSearching = search.trim().length > 0;

  const directoryQuery = useCompanyDirectory(selected);
  const filterQuery = useFilteredCompanies(
    hasAdvancedFilter ? { cat, range, city } : undefined,
  );
  const searchQuery = useCompanies(search, { enabled: isSearching });

  const { data, isLoading, isError } = isSearching
    ? searchQuery
    : hasAdvancedFilter
      ? filterQuery
      : directoryQuery;
  const { refreshing, onRefresh } = useRefresh(directoryQuery, filterQuery, searchQuery);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

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
    <MainLayout
      showHeader={true}
      headerRight={
        <UserAvatar />
      }
    >
      <FlatList
        className="flex-1"
        data={visibleCompanies}
        keyExtractor={(item) => item.co_id}
        numColumns={NUM_COLUMNS}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setPage(1);
              onRefresh();
            }}
            colors={['#5279AC']}
            tintColor="#5279AC"
          />
        }
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
            <Search
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder="Search brands"
              autoCorrect={false}
              returnKeyType="search"
              inputClassName="text-base"
            />
            {!isSearching ? (
              <ChipList
                items={chips}
                selectedId={selected}
                onSelect={onSelectChip}
                containerClassName="gap-2 py-2"
              />
            ) : null}
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
            <ErrorRetry
              message={isSearching ? 'Unable to run that search.' : 'Unable to load companies.'}
              onRetry={() => {
                setPage(1);
                onRefresh();
              }}
            />
          ) : (
            <View className="items-center px-8 py-20">
              <Text className="text-neutral-500 text-center">
                {isSearching ? `No brands match "${search.trim()}".` : 'No companies found.'}
              </Text>
              {isSearching ? (
                <Text className="text-neutral-400 text-sm font-lato mt-2 text-center">
                  Try a different keyword or clear the search to browse all brands.
                </Text>
              ) : null}
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
    </MainLayout >
  );
}
