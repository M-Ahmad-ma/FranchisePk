import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { InvestorDrawer } from './InvestorDrawer';
import { BrandDrawer } from './BrandDrawer';
import { useAuth } from '../../shared/auth/AuthContext';
import type { RootStackParamList } from '../../shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#436CF5" />
      </View>
    );
  }

  // Authenticated brand owners get the brand flow; everyone else gets the
  // investor flow so they can explore the app without signing in.
  const isBrand = user?.role === 'brand' && isAuthenticated;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isBrand ? (
        <Stack.Screen name="BrandDrawer" component={BrandDrawer} />
      ) : (
        <Stack.Screen name="InvestorDrawer" component={InvestorDrawer} />
      )}
      <Stack.Screen name="Auth" component={AuthNavigator} />
    </Stack.Navigator>
  );
}
