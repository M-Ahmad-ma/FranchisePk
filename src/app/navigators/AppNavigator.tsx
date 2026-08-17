import { View, ActivityIndicator } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { InvestorDrawer } from './InvestorDrawer';
import { BrandDrawer } from './BrandDrawer';
import { useAuth } from '../../shared/auth/AuthContext';

export function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#436CF5" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return user?.role === 'brand' ? <BrandDrawer /> : <InvestorDrawer />;
}
