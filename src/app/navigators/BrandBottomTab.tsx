import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Users, Store, User } from 'lucide-react-native';
import { BrandDashboardScreen } from '../../features/brand/screens/BrandDashboardScreen';
import { BrandLeadsScreen } from '../../features/brand/screens/BrandLeadsScreen';
import { BrandFranchisesScreen } from '../../features/brand/screens/BrandFranchisesScreen';
import { BrandProfileScreen } from '../../features/brand/screens/BrandProfileScreen';
import type { BrandTabParamList } from '../../shared/types/navigation';

const Tab = createBottomTabNavigator<BrandTabParamList>();

const tabIcons: Record<keyof BrandTabParamList, (color: string, size: number) => React.ReactNode> = {
  BrandDashboard: (color, size) => <LayoutDashboard color={color} size={size} />,
  BrandFranchises: (color, size) => <Store color={color} size={size} />,
  BrandLeads: (color, size) => <Users color={color} size={size} />,
  BrandProfile: (color, size) => <User color={color} size={size} />,
};

const tabLabels: Record<keyof BrandTabParamList, string> = {
  BrandDashboard: 'Dashboard',
  BrandFranchises: 'Franchises',
  BrandLeads: 'Leads',
  BrandProfile: 'Profile',
};

export function BrandBottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => tabIcons[route.name](color, size),
        tabBarActiveTintColor: '#BC5D00',
        tabBarInactiveTintColor: '#8990A8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#FFEDE4',
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Lato-Bold',
        },
        tabBarLabel: tabLabels[route.name],
      })}
    >
      <Tab.Screen name="BrandDashboard" component={BrandDashboardScreen} />
      <Tab.Screen name="BrandFranchises" component={BrandFranchisesScreen} />
      <Tab.Screen name="BrandLeads" component={BrandLeadsScreen} />
      <Tab.Screen name="BrandProfile" component={BrandProfileScreen} />
    </Tab.Navigator>
  );
}
