import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { InvestorDrawer } from './InvestorDrawer';
import { BrandDrawer } from './BrandDrawer';
import { useAuth } from '../../shared/auth/AuthContext';
import type { RootStackParamList } from '../../shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#436CF5" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="InvestorDrawer"
    >
      <Stack.Screen name="InvestorDrawer" component={InvestorDrawer} />
      <Stack.Screen name="BrandDrawer" component={BrandDrawer} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return <AppContent />;
}
