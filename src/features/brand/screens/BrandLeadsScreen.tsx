import { useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { Skeleton } from '../../../shared/components/Skeleton';
import {
  useBrandCompanies,
  useCompanyLeads,
} from '../../../shared/hooks/useBrand';
import { toArray, fullName } from '../../../shared/utils/collections';
import { getCompanyCoverImage } from '../../../shared/utils/franchise';
import type { Company } from '../../../shared/api/types';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Store,
  UserRoundKey,
} from 'lucide-react-native';
import type { BrandTabParamList } from '../../../shared/types/navigation';
import UserAvatar from '../../../shared/components/UserAvatar';

type SelectedCompany = {
  coId: string;
  coName: string;
};

export function BrandLeadsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<BrandTabParamList>>();
  const route = useRoute<RouteProp<BrandTabParamList, 'BrandLeads'>>();
  const routeCoId = route.params?.coId;
  const routeCoName = route.params?.coName;

  const [selected, setSelected] = useState<SelectedCompany | null>(
    routeCoId ? { coId: String(routeCoId), coName: routeCoName || '' } : null,
  );

  useEffect(() => {
    if (routeCoId) {
      setSelected({ coId: String(routeCoId), coName: routeCoName || '' });
    }
  }, [routeCoId, routeCoName]);

  const companiesQuery = useBrandCompanies();
  const companies = toArray<Company>(companiesQuery.data?.companies ?? []);
  const leadsQuery = useCompanyLeads(selected?.coId);
  const leads = toArray<any>(
    (leadsQuery.data as { investrequests?: any[] } | undefined)?.investrequests,
  );

  const showLeads = selected != null;

  const openCompany = (company: Company) => {
    setSelected({
      coId: String(company.co_id),
      coName: company.co_name || '',
    });
  };

  const showCompanyList = () => {
    setSelected(null);
    navigation.setParams({ coId: undefined, coName: undefined });
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
              onPress={showCompanyList}
              className="w-9 h-9 rounded-full bg-white border border-neutral-200 items-center justify-center"
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
          renderItem={({ item }) => (
            <View className="bg-white rounded-2xl border border-neutral-200 mx-4 my-1.5 p-4">
              <View className="flex flex-row items-center justify-between w-full">
                <Text className="text-neutral-900 font-lato-bold text-sm">
                  {item.e_name || fullName(item.e_firstname, item.e_lastname, 'Investor')}
                </Text>
                {!!item.lead_type && (
                  <View className="bg-primary-200 rounded-full px-2.5 py-1">
                    <Text className="text-primary-700 text-[10px] font-lato-bold uppercase tracking-wider">
                      {item.lead_type}
                    </Text>
                  </View>
                )}
              </View>
              <View className="mt-4">
                <Text className="text-[11px] font-normal text-neutral-700">
                  {item.e_message}
                </Text>
              </View>
              {item.message ? (
                <Text className="text-neutral-600 font-lato text-xs leading-4 mt-3">
                  {item.message}
                </Text>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            leadsQuery.isLoading ? (
              <View className="px-4 mt-2">
                {[0, 1, 2].map((i) => (
                  <View key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 mb-2">
                    <View className="flex-row items-center gap-3">
                      <Skeleton className="w-11 h-11 rounded-full" />
                      <View className="flex-1">
                        <Skeleton className="w-1/2 h-4 mb-1.5" />
                        <Skeleton className="w-2/3 h-3" />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : leadsQuery.isError ? (
              <View className="items-center py-20">
                <Text className="text-neutral-500">Unable to load leads.</Text>
              </View>
            ) : (
              <View className="items-center py-20 px-8">
                <Text className="text-neutral-900 text-lg font-lato-bold">No leads here</Text>
                <Text className="text-neutral-500 text-sm text-center mt-2 leading-5">
                  When investors reach out about this company, they will show up here.
                </Text>
              </View>
            )
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </MainLayout>
    );
  }

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
            <Text className="text-neutral-900 text-2xl font-lato-black">Leads</Text>
            <Text className="text-neutral-500 text-sm mt-0.5">
              Select a brand to view its leads
            </Text>
          </View>
          <Text className="border-[1px] border-gray-300 rounded-xl text-sm font-normal px-5 py-1">
            Investor
          </Text>
        </View>
      </View>

      <FlatList
        className="flex-1"
        data={companies}
        keyExtractor={(item) => String(item.co_id)}
        renderItem={({ item }) => {
          const image = getCompanyCoverImage(item);
          return (
            <TouchableOpacity
              className="flex-row mb-2 items-center gap-4 px-5 py-4 mx-4 bg-white rounded-xl border border-gray-100/70 active:border-primary/20"
              activeOpacity={0.7}
              onPress={() => openCompany(item)}
            >
              {image ? (
                <View className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50">
                  <Image source={image} className="w-full h-full" resizeMode="cover" />
                </View>
              ) : (
                <View className="w-12 h-12 rounded-lg bg-primary-200 items-center justify-center">
                  <Store size={20} color="#5279AC" />
                </View>
              )}
              <View className="flex-1 min-w-0">
                <Text className="text-sm font-semibold text-near-black" numberOfLines={1}>
                  {item.co_name || 'Unnamed'}
                </Text>
                <Text className="text-xs font-normal text-gray-600 mt-0.5">
                  View leads
                </Text>
              </View>
              <ChevronRight size={16} color="#A3ABC4" />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          companiesQuery.isLoading ? (
            <View className="mt-2 px-4">
              {[0, 1, 2].map((i) => (
                <View key={i} className="bg-white rounded-xl my-2 overflow-hidden border border-neutral-200 p-4">
                  <View className="flex-row items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <View className="flex-1">
                      <Skeleton className="w-2/3 h-4 mb-1.5" />
                      <Skeleton className="w-1/3 h-3" />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : companiesQuery.isError ? (
            <View className="items-center py-20">
              <Text className="text-neutral-500">Unable to load brands.</Text>
            </View>
          ) : (
            <View className="items-center py-20 px-8">
              <View className="w-16 h-16 rounded-2xl bg-primary-200 items-center justify-center mb-5">
                <Users size={28} color="#5279AC" />
              </View>
              <Text className="text-neutral-900 text-lg font-lato-bold text-center">
                No brands yet
              </Text>
              <Text className="text-neutral-500 text-sm text-center mt-2 leading-5">
                Add a brand first, then come back to see its leads here.
              </Text>
              <TouchableOpacity
                className="bg-primary-700 rounded-2xl px-6 py-3.5 mt-6"
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('BrandFranchises', { screen: 'BrandCompaniesList' })
                }
              >
                <Text className="text-white font-lato-bold text-sm">Go to Brands</Text>
              </TouchableOpacity>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </MainLayout>
  );
}
