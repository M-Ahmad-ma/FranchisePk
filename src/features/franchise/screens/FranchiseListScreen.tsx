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
import { useRefresh } from '../../../shared/hooks/useRefresh';
import { ErrorRetry } from '../../../shared/components/ErrorRetry';
import UserAvatar from '../../../shared/components/UserAvatar';

const PAGE_SIZE = 8;
const NUM_COLUMNS = 2;
const CARD_GAP = 0.2;
const H_PADDING = 2;
/** Long enough to avoid a request per keystroke, short enough to feel live. */
const SEARCH_DEBOUNCE_MS = 350;
/**
 * How long the footer skeleton stays up when more rows are revealed.
 *
 * Pagination here is client-side (`paginate` over an already-fetched list), so
 * the next page is available in the same tick the footer asks for it. Resetting
 * the flag on the page change made the skeleton live for exactly one commit,
 * which reads as "no loader at all". Holding it briefly gives the scroll
 * feedback the list is meant to show.
 */
const LOAD_MORE_FEEDBACK_MS = 450;

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
  // to whichever source the screen was still using.
  const isSearching = search.trim().length > 0;

  // Multi-step search (HomeV2) arrives as cat/range/city route params. Those
  // params persist for the life of the screen, so `hasAdvancedFilter` alone
  // would pin the list to the filter endpoint forever and a chip tap would
  // change `selected` without changing which query is displayed. Set this
  // when the user picks a chip to hand control back to the directory query;
  // cleared when new multi-step params arrive.
  const [browsingCategories, setBrowsingCategories] = useState(false);

  const showFilterResults = hasAdvancedFilter && !browsingCategories;

  const directoryQuery = useCompanyDirectory(selected);
  const filterQuery = useFilteredCompanies(
    showFilterResults ? { cat, range, city } : undefined,
  );
  const searchQuery = useCompanies(search, { enabled: isSearching });

  const { data, isLoading, isError } = isSearching
    ? searchQuery
    : showFilterResults
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

  // New multi-step search arrived: show its results and drop any chip
  // override, otherwise the previous chip choice would mask the new filter.
  useEffect(() => {
    setBrowsingCategories(false);
  }, [cat, range, city]);

  const companies = data?.companies ?? [];

  const chips: ChipItem[] = [
    {
      c_id: '1',
      c_slug: ALL_SECTORS,
      c_name: 'All',
    },
    ...(data?.categories ?? []),
  ];
  const visibleCompanies = paginate(companies, page, PAGE_SIZE);

  const hasMoreItems = hasMore(companies, page, PAGE_SIZE);

  // Keep the footer skeleton mounted until the delay elapses, then reveal the
  // next page. The cleanup also cancels a pending reveal if the list is
  // refreshed or unmounted mid-scroll.
  useEffect(() => {
    if (!isLoadingMore) return;
    const handle = setTimeout(() => {
      setPage((p) => p + 1);
      setIsLoadingMore(false);
    }, LOAD_MORE_FEEDBACK_MS);
    return () => clearTimeout(handle);
  }, [isLoadingMore]);

  const onSelectChip = (chip: ChipItem) => {
    setSelected(chip.c_slug);
    setPage(1);
    setIsLoadingMore(false);
    // Stop showing the multi-step filter results, so the chip actually has an
    // effect instead of updating `selected` behind a pinned filter query.
    setBrowsingCategories(true);
  };

  const loadMore = () => {
    if (!hasMoreItems || isLoadingMore) return;
    setIsLoadingMore(true);
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
              setIsLoadingMore(false);
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
                setIsLoadingMore(false);
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
