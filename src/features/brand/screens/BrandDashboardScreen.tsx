import { ScrollView, Text, View, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useAuth } from '../../../shared/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { BrandTabParamList } from '../../../shared/types/navigation';
import UserAvatar from '../../../shared/components/UserAvatar';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useBrandDashboard, useBrandCompanies } from '../../../shared/hooks/useBrand';
import { useRefresh } from '../../../shared/hooks/useRefresh';
import { ErrorRetry } from '../../../shared/components/ErrorRetry';
import { toArray } from '../../../shared/utils/collections';
import type { Company } from '../../../shared/api/types';
import {
  Store,
  Users,
  Plus,
  BriefcaseBusiness,
  ChevronRight,
} from 'lucide-react-native';
import { Log } from '../../../shared/utils/Log';
import { imageUrl } from '../../../shared/api/imageUrl';

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
  const companiesQuery = useBrandCompanies();
  const { refreshing, onRefresh } = useRefresh(dashboard, companiesQuery);
  const stats = dashboard.data?.stats;
  const companies = toArray<Company>(companiesQuery.data?.companies ?? []).slice(0, 4);

  Log('companies', companies);
  Log('user', user);
  Log('stats', stats);
  Log('dashboard', dashboard);

  const isLoading = dashboard.isLoading || companiesQuery.isLoading;

  const handleProfilePress = () => {
    navigation.navigate("BrandProfile")
  }


  // Logo click is handled by AppHeaderV2 for every screen.
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
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5279AC']}
            tintColor="#5279AC"
          />
        }
      >
        {(dashboard.isError || companiesQuery.isError) && !isLoading ? (
          <ErrorRetry
            message="Unable to load your dashboard."
            onRetry={onRefresh}
          />
        ) : null}

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
              <Text className="text-neutral-500 text-sm font-normal">Welcome back,</Text>
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

        {/* recent brands → open company leads */}
        <View className="px-4 pb-10">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase">
              Recent Brands
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BrandFranchises', { screen: 'BrandCompaniesList' })}
            >
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
          ) : companies.length === 0 ? (
            <View className="bg-white rounded-2xl border border-neutral-200 items-center py-10 px-6">
              <View className="w-12 h-12 rounded-full bg-tertiary-200 items-center justify-center mb-3">
                <Users size={22} color="#0F9CC9" />
              </View>
              <Text className="text-neutral-500 text-sm text-center">
                No brands yet. Add a brand to start receiving leads.
              </Text>
            </View>
          ) : (
            <View>
              {companies.map((company, index) => {
                const name = company.co_name || 'Unnamed brand';
                const email = company.con_email;
                const number = company.con_mobilenumber;
                const image = company?.company_images?.[0]?.img_name;
                return (
                  <TouchableOpacity
                    key={String(company.co_id ?? index)}
                    className={`flex-row relative items-center mb-3 px-4 py-3.5 bg-white rounded-xl`}
                    style={{ elevation: 2, shadowColor: '#000' }}
                    activeOpacity={0.6}
                    onPress={() =>
                      navigation.navigate('BrandLeads', {
                        coId: String(company.co_id),
                        coName: name,
                        returnTo: 'BrandDashboard',
                      })
                    }
                  >
                    <View className="flex-1">
                      {image && (
                        <View>
                          <Image className='w-20 h-20 bg-gray-400 rounded-xl mb-3' source={{ uri: imageUrl(image) }} alt='image' />
                        </View>
                      )}

                      <View className=" flex items-center justify-between flex-row">
                        <Text className="text-neutral-900 font-lato-bold text-xl" numberOfLines={1}>
                          {name}
                        </Text>
                      </View>
                      <Text className='absolute top-5 right-3 text-xs font-normal'>
                        {number}
                      </Text>

                      <View className='flex flex-row items-center absolute bottom-1 right-1 font-medium text-xs'>
                        <Text className='text-xs font-medium'>view leads</Text>
                        <ChevronRight size={15} />
                      </View>

                      {!!email && (
                        <Text className='text-sm mt-4 font-normal'>{email}</Text>
                      )}
                    </View>
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
