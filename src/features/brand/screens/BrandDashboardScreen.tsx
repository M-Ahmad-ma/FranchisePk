import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useAuth } from '../../../shared/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { BrandTabParamList } from '../../../shared/types/navigation';
import UserAvatar from '../../../shared/components/UserAvatar';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useBrandDashboard, useInvestorRequests } from '../../../shared/hooks/useBrand';
import { toArray, fullName } from '../../../shared/utils/collections';
import type { InvestorLead } from '../../../shared/api/types';
import {
  Store,
  Users,
  Eye,
  Plus,
  ArrowRight,
  BriefcaseBusiness,
  Layers,
} from 'lucide-react-native';
import { Log } from '../../../shared/utils/Log';

function num(value: unknown): string {
  if (value === undefined || value === null || value === '') return '0';
  const n = Number(value);
  return Number.isFinite(n) ? String(n) : '0';
}

export function BrandDashboardScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<BrandTabParamList>>();
  const { user } = useAuth();
  const displayName = user?.name || 'Brand Owner';
  const displayCompany = user?.company || 'My Brand';

  const dashboard = useBrandDashboard();
  const leadsQuery = useInvestorRequests();
  const stats = dashboard.data?.stats;
  const leads = toArray<InvestorLead>(leadsQuery.data?.investrequests).slice(0, 4);

  Log("leads", leads)
  Log("user", user)
  Log("stats", stats)
  Log("dashboard", dashboard)

  const isLoading = dashboard.isLoading || leadsQuery.isLoading;

  const handleProfilePress = () => {
    navigation.navigate("BrandProfile")
  }


  const quickActions = [
    { icon: Plus, label: 'Add Brand', color: '#5279AC', bg: 'bg-primary-200', onPress: () => navigation.navigate('BrandFranchises', { screen: 'BrandCompanyForm' }) },
    { icon: Store, label: 'Manage Brands', color: '#5279AC', bg: 'bg-primary-200', onPress: () => navigation.navigate('BrandFranchises', { screen: 'BrandCompaniesList' }) },
    { icon: Users, label: 'View Leads', color: '#5279AC', bg: 'bg-primary-200', onPress: () => navigation.navigate('BrandLeads') },
  ];


  return (
    <MainLayout
      showHeader={true}
      headerRight={<UserAvatar size={44} onPress={handleProfilePress} />}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={dashboard.isFetching || leadsQuery.isFetching}
            onRefresh={() => {
              dashboard.refetch();
              leadsQuery.refetch();
            }}
            tintColor="#5279AC"
          />
        }
      >
        {/* greeting */}
        <View className="px-4 pt-6 pb-4">
          <View className="flex-row items-center gap-4">
            <View
              style={{
                elevation: 4,
                shadowColor: '#5279AC',
                shadowOpacity: 0.25,
                shadowRadius: 12,
                borderRadius: 999,
              }}
            >
              <UserAvatar
                size={56}
                initialsStyle="full"
                className="bg-primary-700"
                onPress={null}
              />
            </View>
            <View className="flex-1">
              <Text className="text-neutral-500 text-sm">Welcome back,</Text>
              <Text className="text-neutral-900 text-xl font-lato-bold">{displayName}</Text>
            </View>
            <View className="bg-primary-200 border border-primary-300 rounded-full px-3 py-1.5">
              <Text className="text-primary-700 text-xs font-lato-bold uppercase tracking-[1px]">
                {displayCompany}
              </Text>
            </View>
          </View>
        </View>

        {/* overview */}
        <View className="px-4 mb-6">
          <View
            className="bg-primary-700 rounded-2xl p-5"
            style={{ elevation: 4, shadowColor: '#5279AC', shadowOpacity: 0.2, shadowRadius: 14 }}
          >
            <View className="flex-row items-center gap-2 mb-1">
              <BriefcaseBusiness size={18} color="#A4C9FF" />
              <Text className="text-primary-300 text-xs font-lato-bold uppercase tracking-[2px]">
                Brand Overview
              </Text>
            </View>
            {isLoading ? (
              <Skeleton className="w-16 h-9 mt-3" />
            ) : (
              <Text className="text-white text-3xl font-lato-black mt-2">
                {num(stats?.companies)}
              </Text>
            )}
            <Text className="text-primary-300 font-lato text-sm mt-0.5">
              Active franchise opportunities
            </Text>

          </View>

        </View>

        {/* quick actions */}
        <View className="px-4 mb-6">
          <Text className="text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase mb-3">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                className="flex-1 bg-white rounded-2xl border border-neutral-200 p-4 items-center"
                activeOpacity={0.7}
                onPress={action.onPress}
                style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}
              >
                <View className={`w-11 h-11 rounded-xl ${action.bg} items-center justify-center mb-2.5`}>
                  <action.icon size={20} color={action.color} />
                </View>
                <Text className="text-neutral-800 text-xs font-lato-bold text-center leading-4">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* recent leads */}
        <View className="px-4 pb-10">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase">
              Recent Leads
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('BrandLeads')}>
              <Text className="text-primary-700 font-lato-bold text-sm">View all</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="bg-white rounded-2xl border border-neutral-200 p-4 gap-4">
              {[0, 1, 2].map((i) => (
                <View key={i} className="flex-row items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <View className="flex-1">
                    <Skeleton className="w-2/3 h-4 mb-1" />
                    <Skeleton className="w-1/3 h-3" />
                  </View>
                </View>
              ))}
            </View>
          ) : leads.length === 0 ? (
            <View className="bg-white rounded-2xl border border-neutral-200 items-center py-10 px-6">
              <View className="w-12 h-12 rounded-full bg-tertiary-200 items-center justify-center mb-3">
                <Users size={22} color="#0F9CC9" />
              </View>
              <Text className="text-neutral-500 text-sm text-center">
                No leads yet. When investors reach out, they'll appear here.
              </Text>
            </View>
          ) : (
            <View
              className="bg-white rounded-2xl border border-neutral-200"
              style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}
            >
              {leads.map((lead, index) => {
                const name = lead.e_firstname || fullName(lead.e_firstname, lead.e_lastname, 'Investor');
                const contact = lead.e_phonenumber || lead.co_name || lead.email || '';
                return (
                  <TouchableOpacity
                    key={String(lead.id ?? index)}
                    className={`flex-row items-center px-4 py-3.5 ${index < leads.length - 1 ? 'border-b border-neutral-200' : ''}`}
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('BrandLeads')}
                  >
                    {/* <View className="w-10 h-10 rounded-full bg-tertiary-200 items-center justify-center"> */}
                    {/*   <Text className="text-tertiary-700 font-lato-bold"> */}
                    {/*     {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()} */}
                    {/*   </Text> */}
                    {/* </View> */}
                    <View className="flex-1 ml-3">
                      <View className='flex items-center justify-between flex-row'>
                        <Text className="text-neutral-900 font-lato-bold text-lg">{name}</Text>
                        {/* <Text className="text-neutral-500 text-[12px] font-normal ">{contact}</Text> */}
                      </View>

                      <Text className='text-sm w-[70%] font-normal mt-3'>{lead.e_message}</Text>
                    </View>
                    <Eye size={16} color="#A3ABC4" />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
}
