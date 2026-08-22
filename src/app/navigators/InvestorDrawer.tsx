import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import {
  Home,
  LayoutDashboard,
  Users,
  CircleQuestionMark,
  Briefcase,
  ChevronRight,
  UserPlus,
  LogIn,
} from 'lucide-react-native';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InvestorBottomTab } from './InvestorBottomTab';
import { TeamScreen } from '../../features/investor/screens/TeamScreen';
import { ContactUs } from '../../features/investor/screens/ContactUs';
import { Partners } from '../../features/investor/screens/Partners';
import { VacancyScreen } from '../../features/investor/screens/VacancyScreen';
import type { InvestorDrawerParamList, RootStackParamList } from '../../shared/types/navigation';
import { Image } from 'react-native';

const Drawer = createDrawerNavigator<InvestorDrawerParamList>();

type MenuItem = {
  route: keyof InvestorDrawerParamList;
  label: string;
  icon: typeof Home;
};

const menuItems: MenuItem[] = [
  { route: 'MainTabs', label: 'Home', icon: Home },
  { route: 'Team', label: 'Our Team', icon: Users },
  { route: 'ContactUs', label: 'Contact us', icon: CircleQuestionMark },
  { route: 'Partners', label: 'Partners', icon: LayoutDashboard },
  { route: 'Vacancies', label: 'Vacancies', icon: Briefcase },
];

const ACTIVE_COLOR = '#5279AC';
const INACTIVE_COLOR = '#8990A8';

type CustomDrawerContentProps = DrawerContentComponentProps;

function CustomDrawerContent({
  state,
  navigation,
}: CustomDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routeNames[state.index];

  const goToAuth = () => {
    const root = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    root?.navigate('Auth', { screen: 'Signup' });
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const handlePress = (route: keyof InvestorDrawerParamList) => {
    navigation.navigate(route as never);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <View className="flex-1 bg-white">
      <View
        className=" py-7 p-3 bg-primary-900 border-b-[0.5px] border-neutral-200"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Image className='w-[200px]' resizeMode='stretch' source={require("../../../assets/FranchiseLogo.png")} />

      </View>

      <View className="flex-1 py-8">
        {menuItems.map(({ route, label, icon: Icon }) => {
          const isActive = activeRoute === route;
          const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <Pressable
              key={route}
              onPress={() => handlePress(route)}
              className={`${isActive ? 'border-l-primary-700 border-l-[5px]' : ''} flex-row items-center justify-between px-4 py-3.5`}
              style={{
                backgroundColor: isActive ? '#EDF0FF' : 'transparent',
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
          onPress={goToAuth}
          className="flex-row items-center justify-center gap-2 rounded-xl bg-primary-700 py-3"
        >
          <LogIn size={18} color="#FFFFFF" />
          <Text className="text-white font-lato-bold">Sign In</Text>
        </Pressable>
        <Pressable
          onPress={goToAuth}
          className="flex-row items-center justify-center gap-2 rounded-xl border border-neutral-300 py-3"
        >
          <UserPlus size={18} color="#565E74" />
          <Text className="text-neutral-700 font-lato-bold">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function InvestorDrawer() {
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
      <Drawer.Screen name="MainTabs" component={InvestorBottomTab} />
      <Drawer.Screen name="Team" component={TeamScreen} />
      <Drawer.Screen name="ContactUs" component={ContactUs} />
      <Drawer.Screen name="Partners" component={Partners} />
      <Drawer.Screen name="Vacancies" component={VacancyScreen} />
    </Drawer.Navigator>
  );
}
