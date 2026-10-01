import { FlatList, Text, View, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useState, type ReactNode } from 'react';
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
import { useRefresh } from '../../../shared/hooks/useRefresh';
import { ErrorRetry } from '../../../shared/components/ErrorRetry';
import { toArray } from '../../../shared/utils/collections';
import { getCompanyCoverImage } from '../../../shared/utils/franchise';
import type { Company } from '../../../shared/api/types';
import { ChevronRight, Plus, Store, Pencil, User, Phone, Mail } from 'lucide-react-native';
import { Log } from '../../../shared/utils/Log';
import UserAvatar from '../../../shared/components/UserAvatar';
import { MinimalCard } from '../components/MinimalCard';
import CompanyCard from '../components/CompanyCard';

type Navigation = CompositeNavigationProp<
  NativeStackNavigationProp<BrandFranchisesStackParamList>,
  BottomTabNavigationProp<BrandTabParamList>
>;

export function BrandCompaniesListScreen() {
  const navigation = useNavigation<Navigation>();
  const query = useBrandCompanies();
  const { refreshing, onRefresh } = useRefresh(query);
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
        className="flex-1 px-2"
        data={companies}
        keyExtractor={(item) => String(item.co_id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5279AC']}
            tintColor="#5279AC"
          />
        }
        renderItem={({ item }) => (
          <CompanyListItem
            item={item}
            onEdit={() =>
              navigation.navigate('BrandCompanyForm', {
                id: String(item.co_id),
              })
            }
            onViewLeads={() =>
              navigation.navigate('BrandLeads', {
                coId: String(item.co_id),
                coName: item.co_name,
                returnTo: 'BrandFranchises',
              })
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
            <ErrorRetry
              message="Unable to load your brands."
              onRetry={onRefresh}
            />
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

type CompanyListItemProps = {
  item: Company;
  onEdit: () => void;
  onViewLeads: () => void;
};

function StatusPill({ active }: { active: boolean }) {
  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${active ? 'bg-tertiary-200' : 'bg-neutral-200'
        }`}
    >
      <View
        className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-tertiary-700' : 'bg-neutral-500'}`}
      />
      <Text
        className={`font-lato-bold text-[10px] uppercase tracking-[1px] ${active ? 'text-tertiary-900' : 'text-neutral-600'
          }`}
      >
        {active ? 'Active' : 'Inactive'}
      </Text>
    </View>
  );
}

function MetaRow({ icon, value }: { icon: ReactNode; value?: string }) {
  if (!value) return null;
  return (
    <View className="flex-row items-center gap-1.5 mt-1.5">
      {icon}
      <Text className="font-lato text-xs text-neutral-700" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function CompanyListItem({ item, onEdit, onViewLeads }: CompanyListItemProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const cover = getCompanyCoverImage(item);
  const imageUri = !imageFailed ? cover?.uri : undefined;
  const isActive = item.co_status === '1';
  const contact = item.company_contacts?.[0];
  const phone = item.con_mobilenumber || contact?.con_mobilenumber;
  const email = item.con_email || contact?.con_email;
  const initials =
    item.co_name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || '?';

  return (
    <View
      className="mb-3 overflow-hidden rounded-2xl border border-neutral-300 bg-white"
      style={{ elevation: 2, shadowColor: '#1C4878', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }}
    >
      <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-700" />

      <View className="flex-row gap-3.5 py-4 pl-5 pr-4">
        {imageUri ? (
          <Image
            className="h-[76px] w-[76px] rounded-xl bg-neutral-200"
            source={{ uri: imageUri }}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
            accessibilityLabel={`${item.co_name} cover`}
          />
        ) : (
          <View className="h-[76px] w-[76px] items-center justify-center rounded-xl bg-primary-200">
            <Text className="font-lato-black text-xl text-primary-800">{initials}</Text>
          </View>
        )}

        <View className="flex-1 min-w-0">
          <View className="flex-row items-start justify-between gap-2">
            <Text
              className="flex-1 font-lato-black text-base text-neutral-900"
              numberOfLines={1}
            >
              {item.co_name || 'Unnamed brand'}
            </Text>
            {/* <StatusPill active={isActive} /> */}
          </View>

          <MetaRow
            icon={<Phone size={13} color="#8990A8" />}
            value={phone}
          />
          <MetaRow
            icon={<Mail size={13} color="#8990A8" />}
            value={email}
          />
          {!phone && !email && (
            <Text className="mt-1.5 font-lato-italic text-xs text-neutral-500">
              No contact details yet
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="h-10 w-10 items-center justify-center self-start rounded-full bg-primary-200 active:bg-primary-300"
          activeOpacity={0.7}
          hitSlop={8}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.co_name}`}
        >
          <Pencil size={16} color="#386092" />
        </TouchableOpacity>
      </View>

      <View className="border-t border-dashed border-neutral-300 px-4 py-3">
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 rounded-xl bg-primary-200 py-3 active:bg-primary-300"
          activeOpacity={0.75}
          onPress={onViewLeads}
          accessibilityRole="button"
          accessibilityLabel={`View leads for ${item.co_name}`}
        >
          <Text className="font-lato-bold text-sm text-primary-800">View leads</Text>
          <ChevronRight size={16} color="#386092" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
//
// type MinimalCardProps = {
//   name?: string;
//   imageUrl?: { uri: string };
//   onPress?: () => void;
//   onEdit?: () => void;
//   website_url?: string;
//   co_office_number?: string;
// };

// function MinimalCard({
//   name,
//   imageUrl,
//   onPress,
//   onEdit,
//   con_email,
//   co_office_number,
//   con_mobilenumber
// }: MinimalCardProps) {
//   return (
//     <View className="flex-row mb-2 items-center gap-3 px-5 py-4 bg-white rounded-xl border border-gray-100/70">
//       <TouchableOpacity
//         className="flex-row flex-1 min-w-0 items-center gap-5"
//         onPress={onPress}
//         activeOpacity={0.7}
//       >
//         {imageUrl && (
//           <View className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50">
//             <Image source={imageUrl} className="w-full h-full" resizeMode="cover" />
//           </View>
//         )}
//
//         <View className="flex-1 min-w-0">
//           <View className="flex flex-row items-center justify-between">
//             <Text className="text-sm font-semibold text-near-black" numberOfLines={1}>
//               {name || 'Unnamed'}
//             </Text>
//
//             <Text className="text-[12px] font-normal text-gray-600">
//               {con_mobilenumber}
//             </Text>
//           </View>
//           <Text className="text-sm font-normal text-gray-600">
//             {con_email || co_office_number || 'no website'}
//           </Text>
//         </View>
//
//         <ChevronRight size={16} color="#A3ABC4" />
//       </TouchableOpacity>
//
//       <TouchableOpacity
//         className="w-9 h-9 rounded-full bg-primary-200 items-center justify-center"
//         activeOpacity={0.7}
//         onPress={onEdit}
//         hitSlop={8}
//         accessibilityLabel="Edit brand"
//       >
//         <Pencil size={15} color="#386092" />
//       </TouchableOpacity>
//     </View>
//   );
// }
