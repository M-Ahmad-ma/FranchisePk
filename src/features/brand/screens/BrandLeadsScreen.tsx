import { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useCompanyLeads, useUserLeads } from '../../../shared/hooks/useBrand';
import { toArray, fullName } from '../../../shared/utils/collections';
import type { InvestorLead } from '../../../shared/api/types';
import { Users, ChevronLeft, ChevronRight, Store } from 'lucide-react-native';
import type { BrandTabParamList } from '../../../shared/types/navigation';
import UserAvatar from '../../../shared/components/UserAvatar';
import { useRefresh } from '../../../shared/hooks/useRefresh';
import { ErrorRetry } from '../../../shared/components/ErrorRetry';

type SelectedCompany = {
  coId: string;
  coName: string;
};

export function BrandLeadsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<BrandTabParamList>>();
  const route = useRoute<RouteProp<BrandTabParamList, 'BrandLeads'>>();
  const routeCoId = route.params?.coId;
  const routeCoName = route.params?.coName;
  const returnTo = route.params?.returnTo;

  const [selected, setSelected] = useState<SelectedCompany | null>(
    routeCoId ? { coId: String(routeCoId), coName: routeCoName || '' } : null,
  );

  useEffect(() => {
    if (routeCoId) {
      setSelected({ coId: String(routeCoId), coName: routeCoName || '' });
    }
  }, [routeCoId, routeCoName]);

  // Leaving the screen resets it, so re-entering the Leads tab always shows
  // the full list of user leads instead of a stale company drill-in.
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSelected(null);
      navigation.setParams({ coId: undefined, coName: undefined, returnTo: undefined });
    });
    return unsubscribe;
  }, [navigation]);

  const showLeads = selected != null;

  const companyLeadsQuery = useCompanyLeads(selected?.coId);
  const allLeadsQuery = useUserLeads(!showLeads);
  const leadsQuery = showLeads ? companyLeadsQuery : allLeadsQuery;
  const leads = toArray<InvestorLead>(leadsQuery.data?.investrequests);
  const leadsRefresh = useRefresh(leadsQuery);

  const showAllLeads = () => {
    setSelected(null);
    navigation.setParams({ coId: undefined, coName: undefined, returnTo: undefined });
  };

  const goBackFromCompany = () => {
    if (returnTo === 'BrandDashboard') {
      navigation.navigate('BrandDashboard');
      return;
    }
    if (returnTo === 'BrandFranchises') {
      navigation.navigate('BrandFranchises', { screen: 'BrandCompaniesList' });
      return;
    }
    showAllLeads();
  };

  if (showLeads) {
    return (
      <MainLayout
        showHeader={true}
        headerRight={
          <UserAvatar />
        }
      >
        <View className="px-4 pt-6 pb-2">
          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goBackFromCompany}
              className="w-9 h-9 rounded-full bg-white border border-neutral-200 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <ChevronLeft size={18} color="#386092" />
            </TouchableOpacity>
            <View className="flex-1 min-w-0">
              <Text className="text-neutral-900 text-2xl font-lato-black" numberOfLines={1}>
                Company Leads
              </Text>
              <Text className="text-neutral-500 text-sm mt-0.5" numberOfLines={1}>
                {selected.coName ? `Leads for ${selected.coName}` : 'Leads for this company'}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          className="flex-1"
          data={leads}
          keyExtractor={(item, i) => String(item.id ?? i)}
          refreshControl={
            <RefreshControl
              refreshing={leadsRefresh.refreshing}
              onRefresh={leadsRefresh.onRefresh}
              colors={['#5279AC']}
              tintColor="#5279AC"
            />
          }
          renderItem={({ item }) => <LeadCard item={item} />}
          ListEmptyComponent={
            <LeadsEmptyState
              isLoading={leadsQuery.isLoading}
              isError={leadsQuery.isError}
              onRetry={leadsRefresh.onRefresh}
              title="No leads here"
              message="When investors reach out about this company, they will show up here."
            />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </MainLayout>
    );
  }

  const count = leads.length;

  return (
    <MainLayout
      showHeader={true}
      headerRight={
        <UserAvatar />
      }
    >
      <View className="px-4 pt-6 pb-2">
        <View className="flex flex-row items-center justify-between">
          <View className="flex-1 min-w-0">
            <Text className="text-neutral-900 text-2xl font-lato-black">Investor Leads</Text>
            <Text className="text-neutral-500 text-sm mt-0.5">
              {leadsQuery.isLoading
                ? 'Loading leads…'
                : `${count} lead${count === 1 ? '' : 's'} across all your brands`}
            </Text>
          </View>
          <View className="border-[1px] border-gray-300 rounded-xl px-5 py-1">
            <Text className="text-neutral-700 text-sm font-lato-bold">Investor</Text>
          </View>
        </View>
      </View>

      <FlatList
        className="flex-1"
        data={leads}
        keyExtractor={(item, i) => String(item.id ?? i)}
        refreshControl={
          <RefreshControl
            refreshing={leadsRefresh.refreshing}
            onRefresh={leadsRefresh.onRefresh}
            colors={['#5279AC']}
            tintColor="#5279AC"
          />
        }
        renderItem={({ item }) => <LeadCard item={item} showCompany />}
        ListEmptyComponent={
          <LeadsEmptyState
            isLoading={leadsQuery.isLoading}
            isError={leadsQuery.isError}
            onRetry={leadsRefresh.onRefresh}
            title="No leads yet"
            message="When investors reach out about any of your brands, they will show up here."
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </MainLayout>
  );
}

function LeadCard({ item, showCompany = false }: { item: InvestorLead; showCompany?: boolean }) {
  const name = item.e_name || fullName(item.e_firstname, item.e_lastname, 'Investor');
  const company = item.co_name;

  return (
    <View className="bg-white rounded-2xl border border-neutral-200 mx-4 my-1.5 p-4">
      <View className="flex flex-row items-center justify-between w-full">
        <Text className="text-neutral-900 font-lato-bold text-sm flex-1 mr-2" numberOfLines={1}>
          {name}
        </Text>
        {!!item.lead_type && (
          <View className="bg-primary-200 rounded-full px-2.5 py-1">
            <Text className="text-primary-700 text-[10px] font-lato-bold uppercase tracking-wider">
              {item.lead_type}
            </Text>
          </View>
        )}
      </View>

      {showCompany && !!company && (
        <View className="flex-row items-center gap-1.5 mt-2">
          <Store size={12} color="#5279AC" />
          <Text
            className="text-primary-700 text-[11px] font-lato-bold uppercase tracking-[1px]"
            numberOfLines={1}
          >
            {company}
          </Text>
        </View>
      )}

      {!!item.e_message && (
        <View className="mt-3">
          <Text className="text-[11px] font-normal text-neutral-700">{item.e_message}</Text>
        </View>
      )}

      {!!item.message && (
        <Text className="text-neutral-600 font-lato text-xs leading-4 mt-3">{item.message}</Text>
      )}
    </View>
  );
}

function LeadsEmptyState({
  isLoading,
  isError,
  onRetry,
  title,
  message,
}: {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  title: string;
  message: string;
}) {
  if (isLoading) {
    return (
      <View className="px-4 mt-2">
        {[0, 1, 2].map((i) => (
          <View key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 mb-2">
            <View className="flex-row items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <View className="flex-1">
                <Skeleton className="mb-1.5 h-4 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </View>
            </View>
            <Skeleton className="mt-3 h-3 w-full" />
          </View>
        ))}
      </View>
    );
  }

  if (isError) {
    return <ErrorRetry message="Unable to load leads." onRetry={onRetry} />;
  }

  return (
    <View className="items-center px-8 py-20">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-primary-200">
        <Users size={28} color="#5279AC" />
      </View>
      <Text className="text-neutral-900 text-lg font-lato-bold text-center">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-neutral-500">{message}</Text>
    </View>
  );
}
