import { useState } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { Skeleton } from '../../../shared/components/Skeleton';
import {
  useInvestorRequests,
  useFranchiseRequests,
  usePropertyRequests,
  useContactMessages,
} from '../../../shared/hooks/useBrand';
import { toArray, fullName } from '../../../shared/utils/collections';
import { Users, Store, Building2, MessageSquare } from 'lucide-react-native';
import { Log } from '../../../shared/utils/Log';

type Tab = 'investor' | 'franchise' | 'property' | 'contact';

const TABS: { key: Tab; label: string }[] = [
  { key: 'investor', label: 'Investors' },
  { key: 'franchise', label: 'Franchise' },
  { key: 'property', label: 'Property' },
  { key: 'contact', label: 'Messages' },
];

export function BrandLeadsScreen() {
  const [tab, setTab] = useState<Tab>('investor');

  const investorQuery = useInvestorRequests();
  const franchiseQuery = useFranchiseRequests();
  const propertyQuery = usePropertyRequests();
  const contactQuery = useContactMessages();

  const active =
    tab === 'investor'
      ? investorQuery
      : tab === 'franchise'
        ? franchiseQuery
        : tab === 'property'
          ? propertyQuery
          : contactQuery;

  const leads = toArray<any>(active.data?.investrequests);



  Log("leads brandlead screen", leads)

  const rowMeta = (lead: any): { title: string; icon: any; color: string, e_message: string } => {
    if (tab === 'investor') {
      return {
        title: lead.e_name || fullName(lead.e_firstname, lead.e_lastname, 'Investor'),
        // subtitle: [lead.co_name, lead.e_phonenumber, lead.email].filter(Boolean).join(' · '),
        e_message: lead.e_message,
        icon: Users,
        color: '#0F9CC9',
      };
    }
    if (tab === 'contact') {
      return {
        title: lead.e_name || fullName(lead.e_firstname, lead.e_lastname, 'Message'),
        // subtitle: lead.subject || lead.e_message || lead.email || '',
        e_message: lead.e_message,
        icon: MessageSquare,
        color: '#5279AC',
      };
    }
    if (tab === 'property') {
      return {
        title: lead.e_name || fullName(lead.e_firstname, lead.e_lastname, 'Enquiry'),
        // subtitle: [lead.property, lead.city, lead.email].filter(Boolean).join(' · '),
        e_message: lead.e_message,
        icon: Building2,
        color: '#00A572',
      };
    }
    return {
      title: lead.e_name || fullName(lead.e_firstname, lead.e_lastname, 'Request'),
      // subtitle: [lead.city, lead.email].filter(Boolean).join(' · '),
      e_message: lead.e_message,
      icon: Store,
      color: '#5279AC',
    };
  };

  return (
    <MainLayout>
      <View className="px-4 pt-6 pb-2">
        <View className='flex flex-row items-center justify-between'>
          <Text className="text-neutral-900 text-2xl font-lato-black">Leads</Text>
          <Text className=' border-[1px] border-gray-300 rounded-xl text-sm font-normal px-5 py-1'>Investor</Text>
        </View>
        <Text className="text-neutral-500 text-sm mt-0.5">
          Everyone interested in your brands
        </Text>
      </View>

      {/* <View className="px-4 pt-2 pb-3 flex-row gap-2"> */}
      {/*   {TABS.map((t) => { */}
      {/*     const isActive = t.key === tab; */}
      {/*     return ( */}
      {/*       <TouchableOpacity */}
      {/*         key={t.key} */}
      {/*         onPress={() => setTab(t.key)} */}
      {/*         activeOpacity={0.7} */}
      {/*         className={`px-4 py-2 rounded-full ${isActive ? 'bg-primary-700' : 'bg-white border border-neutral-200'}`} */}
      {/*       > */}
      {/*         <Text className={`text-sm font-lato-bold ${isActive ? 'text-white' : 'text-neutral-600'}`}> */}
      {/*           {t.label} */}
      {/*         </Text> */}
      {/*       </TouchableOpacity> */}
      {/*     ); */}
      {/*   })} */}
      {/* </View> */}

      <FlatList
        className="flex-1"
        data={leads}
        keyExtractor={(item, i) => String(item.id ?? i)}
        renderItem={({ item }) => {
          const meta = rowMeta(item);
          // const Icon = meta.icon;
          return (
            <View className="bg-white rounded-2xl border border-neutral-200 mx-4 my-1.5 p-4">
              <View>
                {/* <View */}
                {/*   className="w-11 h-11 rounded-full items-center justify-center" */}
                {/*   style={{ backgroundColor: `${meta.color}1A` }} */}
                {/* > */}
                {/*   <Icon size={20} color={meta.color} /> */}
                {/* </View> */}
                <View className="flex flex-row items-center justify-between  w-full ">
                  <Text className="text-neutral-900 font-lato-bold text-sm">{meta.title}</Text>
                  {meta.subtitle ? (
                    <Text className="text-neutral-500 text-xs mt-0.5" numberOfLines={1}>
                      {meta.subtitle}
                    </Text>
                  ) : null}
                </View>
                <View className='mt-5'>
                  <Text className='text-[10px] font-normal'>{meta.e_message}</Text>
                </View>
                {item.lead_type ? (
                  <View className="bg-primary-200 rounded-full px-2.5 py-1">
                    <Text className="text-primary-700 text-[10px] font-lato-bold uppercase tracking-wider">
                      {item.lead_type}
                    </Text>
                  </View>
                ) : null}
              </View>
              {item.message ? (
                <Text className="text-neutral-600 font-lato text-xs leading-4 mt-3">{item.message}</Text>
              ) : null}
            </View>
          );
        }}
        ListEmptyComponent={
          active.isLoading ? (
            <View className="px-4 mt-2">
              {[0, 1, 2, 3].map((i) => (
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
          ) : active.isError ? (
            <View className="items-center py-20">
              <Text className="text-neutral-500">Unable to load leads.</Text>
            </View>
          ) : (
            <View className="items-center py-20 px-8">
              <Text className="text-neutral-900 text-lg font-lato-bold">No leads here</Text>
              <Text className="text-neutral-500 text-sm text-center mt-2 leading-5">
                When investors or customers reach out, they'll show up in this tab.
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
