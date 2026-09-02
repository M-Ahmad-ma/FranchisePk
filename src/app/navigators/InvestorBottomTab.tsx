import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Home, Building2, Compass, CircleQuestionMark } from 'lucide-react-native';
import { HomeScreen } from '../../features/home/screens/HomeScreen';
import { FranchiseStack } from './FranchiseStack';
import { PropertiesStack } from './PropertiesStack';
import type { InvestorTabParamList } from '../../shared/types/navigation';
import { View, Text } from 'react-native';
import { ContactUs } from '../../features/investor/screens/ContactUs';
import HomeV2 from '../../features/franchise/screens/HomeV2';

function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-100">
      <Text className="text-neutral-700 text-lg">{name}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator<InvestorTabParamList>();

const tabIcons: Record<keyof InvestorTabParamList, (color: string, size: number) => React.ReactNode> = {
  Home: (color, size) => <Home color={color} size={size} />,
  FranchiseDirectory: (color, size) => <Compass color={color} size={size} />,
  Properties: (color, size) => <Building2 color={color} size={size} />,
  ContactUs: (color, size) => <CircleQuestionMark color={color} size={size} />
};

export function InvestorBottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const hideTabBar =
          (route.name === 'FranchiseDirectory' && routeName === 'CompanyDetail') ||
          (route.name === 'Properties' && routeName === 'PropertyDetail');

        return {
          headerShown: false,
          tabBarIcon: ({ color, size }) => tabIcons[route.name](color, size),
          tabBarActiveTintColor: '#5279AC',
          tabBarInactiveTintColor: '#8990A8',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#EEF0FF',
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
            display: hideTabBar ? 'none' : 'flex',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: 'Inter-Medium',
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeV2}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="FranchiseDirectory"
        component={FranchiseStack}
        options={{
          tabBarLabel: 'Explore',
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            navigation.navigate('FranchiseDirectory', { screen: 'FranchiseList' });
          },
        }}
      />
      <Tab.Screen
        name="Properties"
        component={PropertiesStack}
        options={{ tabBarLabel: 'Properties' }}
      />
      <Tab.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ tabBarLabel: 'ContactUs' }}
      />

    </Tab.Navigator>
  );
}
