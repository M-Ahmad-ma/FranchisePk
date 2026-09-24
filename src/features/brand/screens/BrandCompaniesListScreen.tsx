import { FlatList, Text, View, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type {
  BrandFranchisesStackParamList,
  BrandTabParamList,
} from '../../../shared/types/navigation';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useBrandCompanies } from '../../../shared/hooks/useBrand';
import { toArray } from '../../../shared/utils/collections';
import { getCompanyCoverImage } from '../../../shared/utils/franchise';
import type { Company } from '../../../shared/api/types';
import { ChevronRight, Plus, Store, Pencil, User } from 'lucide-react-native';
import { Log } from '../../../shared/utils/Log';
import UserAvatar from '../../../shared/components/UserAvatar';

type Navigation = CompositeNavigationProp<
  NativeStackNavigationProp<BrandFranchisesStackParamList>,
  BottomTabNavigationProp<BrandTabParamList>
>;

export function BrandCompaniesListScreen() {
  const navigation = useNavigation<Navigation>();
  const query = useBrandCompanies();
  const companies = toArray<Company>(query.data?.companies ?? query.data);

  const openCompanyLeads = (company: Company) => {
    navigation.navigate('BrandLeads', {
      coId: String(company.co_id),
      coName: company.co_name,
      returnTo: 'BrandFranchises',
    });
  };


  Log("companies", companies)

  return (
    <MainLayout
      showHeader={true}
      headerRight={
        <UserAvatar />
      }
    >
      <View className="px-4 pt-6 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-neutral-900 text-2xl font-lato-black">My Brands</Text>
          <Text className="text-neutral-500 text-sm mt-0.5">
            {companies.length} franchise{companies.length === 1 ? '' : 's'} listed
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary-700 rounded-2xl px-4 py-3 flex-row items-center gap-2"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('BrandCompanyForm', {})}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text className="text-white font-lato-bold text-sm">Add Brand</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        className="flex-1"
        data={companies}
        keyExtractor={(item) => String(item.co_id)}
        refreshControl={
          <RefreshControl
            refreshing={query.isFetching}
            onRefresh={query.refetch}
            tintColor="#5279AC"
          />
        }
        renderItem={({ item }) => (
          <MinimalCard
            key={item.co_id}
            name={item.co_name}
            website_url={item.co_website_url}
            co_office_number={item.co_office_number}
            imageUrl={getCompanyCoverImage(item)}
            onPress={() => openCompanyLeads(item)}
            onEdit={() =>
              navigation.navigate('BrandCompanyForm', { id: String(item.co_id) })
            }
          />
        )}
        ListEmptyComponent={
          query.isLoading ? (
            <View className="mt-2">
              {[0, 1, 2].map((i) => (
                <View key={i} className="bg-white rounded-xl mx-2 my-2 overflow-hidden">
                  <Skeleton className="w-full h-44 rounded-xl" />
                  <View className="px-4 pb-4 pt-2">
                    <Skeleton className="w-2/3 h-6 mb-2" />
                    <Skeleton className="w-1/3 h-5" />
                  </View>
                </View>
              ))}
            </View>
          ) : query.isError ? (
            <View className="items-center py-20">
              <Text className="text-neutral-500">Unable to load your brands.</Text>
            </View>
          ) : (
            <View className="items-center py-20 px-8">
              <View className="w-16 h-16 rounded-2xl bg-primary-200 items-center justify-center mb-5">
                <Store size={28} color="#5279AC" />
              </View>
              <Text className="text-neutral-900 text-lg font-lato-bold text-center">
                No brands yet
              </Text>
              <Text className="text-neutral-500 text-sm text-center mt-2 leading-5">
                Add your first franchise listing to start attracting investors.
              </Text>
              <TouchableOpacity
                className="bg-primary-700 rounded-2xl px-6 py-3.5 mt-6 flex-row items-center gap-2"
                activeOpacity={0.85}
                onPress={() => navigation.navigate('BrandCompanyForm', {})}
              >
                <Plus size={18} color="#FFFFFF" />
                <Text className="text-white font-lato-bold text-sm">Add Brand</Text>
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

type MinimalCardProps = {
  name?: string;
  imageUrl?: { uri: string };
  onPress?: () => void;
  onEdit?: () => void;
  website_url?: string;
  co_office_number?: string;
};

function MinimalCard({
  name,
  imageUrl,
  onPress,
  onEdit,
  website_url,
  co_office_number,
}: MinimalCardProps) {
  return (
    <View className="flex-row mb-2 items-center gap-3 px-5 py-4 bg-white rounded-xl border border-gray-100/70">
      <TouchableOpacity
        className="flex-row flex-1 min-w-0 items-center gap-5"
        onPress={onPress}
        activeOpacity={0.7}
      >
        {imageUrl && (
          <View className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50">
            <Image source={imageUrl} className="w-full h-full" resizeMode="cover" />
          </View>
        )}

        <View className="flex-1 min-w-0">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-near-black" numberOfLines={1}>
              {name || 'Unnamed'}
            </Text>

            <Text className="text-[12px] font-normal text-gray-600">
              {co_office_number || 'not provided'}
            </Text>
          </View>
          <Text className="text-sm font-normal text-gray-600">
            {website_url || co_office_number || 'no website'}
          </Text>
        </View>

        <ChevronRight size={16} color="#A3ABC4" />
      </TouchableOpacity>

      <TouchableOpacity
        className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center"
        activeOpacity={0.7}
        onPress={onEdit}
        hitSlop={8}
        accessibilityLabel="Edit brand"
      >
        <Pencil size={15} color="#386092" />
      </TouchableOpacity>
    </View>
  );
}
