import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { HelpCircle, LogOut, ChevronRight, Shield, Store, Building2, Globe } from 'lucide-react-native';
import Avatar from '../../../shared/components/Avatar';
import Button from '../../../shared/components/Button';
import { useAuth } from '../../../shared/auth/AuthContext';
import { imageUrl } from '../../../shared/api/imageUrl';

const menuItems = [
  { icon: Store, label: 'Brand Profile', color: '#FD8E3A', bg: 'bg-secondary-200' },
  { icon: Building2, label: 'Franchise Listings', color: '#436CF5', bg: 'bg-primary-200' },
  { icon: Globe, label: 'Website & Socials', color: '#0F9CC9', bg: 'bg-tertiary-200' },
  { icon: Shield, label: 'Privacy & Security', color: '#00A572', bg: 'bg-[#BEFFDB]' },
  { icon: HelpCircle, label: 'Help & Support', color: '#E0409A', bg: 'bg-[#FFE4F0]' },
];

export function BrandProfileScreen() {
  const { user, logout } = useAuth();
  const displayName = user?.name || 'Brand Owner';
  const displayEmail = user?.email || '';
  const displayCompany = user?.company || 'My Brand';
  const avatarUri = imageUrl(user?.image);

  return (
    <MainLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center pt-6 pb-4 px-4">
          <View className="mb-4" style={{ elevation: 4, shadowColor: '#FD8E3A', shadowOpacity: 0.2, shadowRadius: 12, borderRadius: 999 }}>
            <Avatar
              source={avatarUri ? { uri: avatarUri } : undefined}
              size={88}
              initials={user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'BR'}
              className="bg-secondary-700"
            />
          </View>
          <Text className="text-neutral-900 text-2xl font-lato-bold">{displayName}</Text>
          <Text className="text-neutral-500 text-sm mt-1">{displayEmail || 'example@gmail.com'}</Text>
          <View className="bg-secondary-200 border border-secondary-300 rounded-full px-5 py-1.5 mt-3">
            <Text className="text-secondary-700 text-xs font-lato-bold uppercase tracking-[1px]">{displayCompany}</Text>
          </View>
        </View>

        {/* Account Settings */}
        <View className="px-4 mb-6">
          <Text className="text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase mb-3">
            Brand Settings
          </Text>
          <View className="bg-white rounded-2xl border border-neutral-200" style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8 }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                className={`flex-row items-center px-5 py-4 ${index < menuItems.length - 1 ? 'border-b border-neutral-200' : ''}`}
                activeOpacity={0.6}
              >
                <View className={`w-10 h-10 rounded-xl ${item.bg} items-center justify-center`}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text className="flex-1 text-neutral-900 ml-3 font-lato text-base">
                  {item.label}
                </Text>
                <ChevronRight size={18} color="#A3ABC4" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <View className="px-4 pb-10">
          <Button
            title="Sign Out"
            variant="outlined"
            className="py-3.5"
            icon={<LogOut size={18} color="blue" />}
            iconPosition="left"
            onPress={() => logout()}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
}
