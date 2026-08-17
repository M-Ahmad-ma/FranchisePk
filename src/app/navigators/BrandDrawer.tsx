import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import {
  LayoutDashboard,
  Store,
  Users,
  User,
  ChevronRight,
  LogIn,
  LogOut,
} from 'lucide-react-native';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { BrandBottomTab } from './BrandBottomTab';
import { BrandProfileScreen } from '../../features/brand/screens/BrandProfileScreen';
import { BrandLeadsScreen } from '../../features/brand/screens/BrandLeadsScreen';
import type { BrandDrawerParamList } from '../../shared/types/navigation';
import { useAuth } from '../../shared/auth/AuthContext';

const Drawer = createDrawerNavigator<BrandDrawerParamList>();

type MenuItem = {
  route: keyof BrandDrawerParamList;
  label: string;
  icon: typeof LayoutDashboard;
};

const menuItems: MenuItem[] = [
  { route: 'BrandTabs', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'BrandLeads', label: 'Investor Leads', icon: Users },
  { route: 'BrandProfile', label: 'Profile', icon: User },
];

const ACTIVE_COLOR = '#BC5D00';
const INACTIVE_COLOR = '#8990A8';

type CustomDrawerContentProps = DrawerContentComponentProps;

function CustomDrawerContent({
  state,
  navigation,
}: CustomDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const activeRoute = state.routeNames[state.index];

  const handlePress = (route: keyof BrandDrawerParamList) => {
    navigation.navigate(route as never);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <View className="flex-1 bg-white">
      <View
        className="py-7 p-3 bg-secondary-700 border-b-[0.5px] border-neutral-200"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-xl bg-secondary-400 items-center justify-center">
            <Store size={22} color="#3A2B00" />
          </View>
          <Text className="text-white font-lato-black text-xl">Brand Hub</Text>
        </View>
      </View>

      <View className="flex-1 py-8">
        {menuItems.map(({ route, label, icon: Icon }) => {
          const isActive = activeRoute === route;
          const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <Pressable
              key={route}
              onPress={() => handlePress(route)}
              className={`${isActive ? 'border-l-secondary-700 border-l-[5px]' : ''} flex-row items-center justify-between px-4 py-3.5`}
              style={{
                backgroundColor: isActive ? '#FFF3EA' : 'transparent',
              }}
            >
              <View className="flex-row items-center gap-3">
                <Icon color={color} size={20} />
                <Text
                  className="text-[15px]"
                  style={{
                    fontFamily: 'lato',
                    fontWeight: '500',
                    color,
                  }}
                >
                  {label}
                </Text>
              </View>
              <ChevronRight size={18} color={INACTIVE_COLOR} />
            </Pressable>
          );
        })}
      </View>

      <View
        className="border-t-[0.5px] border-neutral-200 px-4 py-4 gap-2"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={() => logout()}
          className="flex-row items-center justify-center gap-2 rounded-xl bg-secondary-700 py-3"
        >
          <LogIn size={18} color="#FFFFFF" />
          <Text className="text-white font-lato-bold">Sign In</Text>
        </Pressable>
        <Pressable
          onPress={() => logout()}
          className="flex-row items-center justify-center gap-2 rounded-xl border border-neutral-300 py-3"
        >
          <LogOut size={18} color="#565E74" />
          <Text className="text-neutral-700 font-lato-bold">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function BrandDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 300,
        },
        drawerType: 'front',
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
    >
      <Drawer.Screen name="BrandTabs" component={BrandBottomTab} />
      <Drawer.Screen name="BrandLeads" component={BrandLeadsScreen} />
      <Drawer.Screen name="BrandProfile" component={BrandProfileScreen} />
    </Drawer.Navigator>
  );
}
