import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useAuth } from '../../../shared/auth/AuthContext';
import Avatar from '../../../shared/components/Avatar';
import { imageUrl } from '../../../shared/api/imageUrl';
import { Store, TrendingUp, Users, Eye, Plus, ArrowRight, BriefcaseBusiness } from 'lucide-react-native';

const stats = [
  { icon: Eye, label: 'Profile Views', value: '1,284', color: '#FD8E3A', bg: 'bg-secondary-200' },
  { icon: Users, label: 'Investor Leads', value: '48', color: '#0F9CC9', bg: 'bg-tertiary-200' },
  { icon: TrendingUp, label: 'Franchise Growth', value: '+12%', color: '#00A572', bg: 'bg-[#BEFFDB]' },
];

const recentLeads = [
  { name: 'Ahmed Raza', city: 'Lahore', investment: 'PKR 15M', time: '2h ago' },
  { name: 'Sana Malik', city: 'Karachi', investment: 'PKR 8M', time: 'Yesterday' },
  { name: 'Usman Tariq', city: 'Islamabad', investment: 'PKR 12M', time: '2d ago' },
];

const quickActions = [
  { icon: Plus, label: 'Add Listing', color: '#FD8E3A', bg: 'bg-secondary-200' },
  { icon: Store, label: 'Manage Brands', color: '#436CF5', bg: 'bg-primary-200' },
  { icon: Users, label: 'View Leads', color: '#0F9CC9', bg: 'bg-tertiary-200' },
];

export function BrandDashboardScreen() {
  const { user } = useAuth();
  const displayName = user?.name || 'Brand Owner';
  const displayCompany = user?.company || 'My Brand';
  const avatarUri = imageUrl(user?.image);

  return (
    <MainLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* greeting */}
        <View className="px-4 pt-6 pb-5">
          <View className="flex-row items-center gap-4">
            <View
              style={{
                elevation: 4,
                shadowColor: '#FD8E3A',
                shadowOpacity: 0.25,
                shadowRadius: 12,
                borderRadius: 999,
              }}
            >
              <Avatar
                source={avatarUri ? { uri: avatarUri } : undefined}
                size={56}
                initials={
                  user?.name
                    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'BR'
                }
                className="bg-secondary-700"
              />
            </View>
            <View className="flex-1">
              <Text className="text-neutral-500 text-sm">Welcome back,</Text>
              <Text className="text-neutral-900 text-xl font-lato-bold">{displayName}</Text>
            </View>
            <View className="bg-secondary-200 border border-secondary-300 rounded-full px-3 py-1.5">
              <Text className="text-secondary-700 text-xs font-lato-bold uppercase tracking-[1px]">
                {displayCompany}
              </Text>
            </View>
          </View>
        </View>

        {/* stats */}
        <View className="px-4 mb-6">
          <View className="bg-secondary-700 rounded-3xl p-5 mb-5" style={{ elevation: 4, shadowColor: '#BC5D00', shadowOpacity: 0.2, shadowRadius: 14 }}>
            <View className="flex-row items-center gap-2 mb-1">
              <BriefcaseBusiness size={18} color="#FFB787" />
              <Text className="text-secondary-300 text-xs font-lato-bold uppercase tracking-[2px]">
                Brand Overview
              </Text>
            </View>
            <Text className="text-white text-3xl font-lato-black mt-2">18</Text>
            <Text className="text-secondary-300 font-lato text-sm mt-0.5">
              Active franchise opportunities
            </Text>
            <TouchableOpacity
              className="bg-secondary-400 rounded-full px-4 py-2.5 flex-row items-center gap-2 self-start mt-4"
              activeOpacity={0.85}
            >
              <Text className="text-[#3A2B00] font-lato-bold text-sm">Add New Listing</Text>
              <ArrowRight size={16} color="#3A2B00" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3">
            {stats.map((stat) => (
              <View
                key={stat.label}
                className="flex-1 bg-white rounded-2xl border border-neutral-200 p-4 items-center"
                style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}
              >
                <View className={`w-10 h-10 rounded-xl ${stat.bg} items-center justify-center mb-3`}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text className="text-neutral-900 text-lg font-lato-bold">{stat.value}</Text>
                <Text className="text-neutral-500 text-xs mt-0.5 text-center">{stat.label}</Text>
              </View>
            ))}
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
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-secondary-700 font-lato-bold text-sm">View all</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white rounded-2xl border border-neutral-200" style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}>
            {recentLeads.map((lead, index) => (
              <TouchableOpacity
                key={lead.name}
                className={`flex-row items-center px-4 py-3.5 ${index < recentLeads.length - 1 ? 'border-b border-neutral-200' : ''}`}
                activeOpacity={0.6}
              >
                <View className="w-10 h-10 rounded-full bg-tertiary-200 items-center justify-center">
                  <Text className="text-tertiary-700 font-lato-bold">
                    {lead.name.split(' ').map((n) => n[0]).join('')}
                  </Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-neutral-900 font-lato-bold text-sm">{lead.name}</Text>
                  <Text className="text-neutral-500 text-xs mt-0.5">
                    {lead.city} · {lead.investment}
                  </Text>
                </View>
                <Text className="text-neutral-400 text-xs">{lead.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}
