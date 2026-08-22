import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { SignupScreen } from '../../features/auth/screens/SignupScreen';
import { ForgotPasswordScreen } from '../../features/auth/screens/ForgotPasswordScreen';
import { InvestorGetStartedScreen } from '../../features/auth/screens/InvestorGetStartedScreen';
import { BrandLoginScreen } from '../../features/brand/screens/BrandLoginScreen';
import { BrandSignupScreen } from '../../features/brand/screens/BrandSignupScreen';
import { BrandForgotPasswordScreen } from '../../features/brand/screens/BrandForgotPasswordScreen';
import type { AuthStackParamList } from '../../shared/types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="InvestorGetStarted" component={InvestorGetStartedScreen} />
      <Stack.Screen name="BrandLogin" component={BrandLoginScreen} />
      <Stack.Screen name="BrandSignup" component={BrandSignupScreen} />
      <Stack.Screen name="BrandForgotPassword" component={BrandForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
