import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList, RootStackParamList } from '../../../shared/types/navigation';
import { useAuth } from '../../../shared/auth/AuthContext';
import { ArrowLeft } from 'lucide-react-native';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Login'>>();
  const role = route.params?.role;
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password, role ?? 'investor');
      const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
      rootNav?.reset({ index: 0, routes: [{ name: role === 'brand' ? 'BrandDrawer' : 'InvestorDrawer' }] });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {role && (
        <View className="absolute top-6 left-6 right-6 flex-row items-center justify-between z-50">
          <TouchableOpacity
            onPress={() => navigation.replace('Signup', { role })}
            activeOpacity={0.7}
            className="flex-row items-center gap-2"
          >
            <View className="w-9 h-9 rounded-full bg-primary-200 border border-primary-300 items-center justify-center">
              <ArrowLeft size={16} color="#5279AC" />
            </View>
            <Text className="text-primary-700 font-lato-bold text-sm">Change role</Text>
          </TouchableOpacity>
          <View className="rounded-full bg-primary-200 border border-primary-300 px-3 py-1.5">
            <Text className="text-primary-700 font-lato-bold text-xs capitalize">
              {role} account
            </Text>
          </View>
        </View>
      )}

      <View className="flex-1 px-6 pt-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <View className="mb-8">
          <Text className="text-center text-primary-900 text-3xl font-lato-bold">Franchise Pakistan</Text>
          <Text className="text-center text-neutral-600 text-base mt-1">
            Premium access to global expansion.
          </Text>
        </View>

        <View className="flex-row mb-6 ">
          <View className="flex-1 py-2 border-b-2 border-primary-700">
            <Text className="text-primary-700 text-center font-lato-bold text-base">Login</Text>
          </View>
          <TouchableOpacity
            className="flex-1 py-2 border-b-2 border-neutral-200"
            onPress={() => navigation.navigate('Signup', { role })}
            activeOpacity={0.7}
          >
            <Text className="text-neutral-600 text-center font-lato-bold text-base">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text className="text-red-500 text-sm text-center mb-3">{error}</Text>
        ) : null}

        <View className="bg-white w-full rounded-2xl p-2 border border-neutral-200 mb-4">
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#8990A8"
            className="px-4 py-3 text-neutral-900"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="bg-white w-full rounded-2xl p-2 border border-neutral-200 mb-2">
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8990A8"
            className="px-4 py-3 text-neutral-900"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity className="items-end mb-6" onPress={() => navigation.navigate('ForgotPassword')}>
          <Text className="text-primary-700 font-lato-bold text-sm">Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-primary-700 w-full rounded-2xl py-4 items-center mb-6"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-primary-100 font-lato-bold text-base">Access Portfolio</Text>
          )}
        </TouchableOpacity>

        <View className="flex-1 justify-end pb-6 w-full">
          <Text className="text-neutral-600 text-center text-sm">
            By continuing, you agree to our{' '}
            <Text className="text-primary-700 font-lato-bold">Terms of Service</Text> and{' '}
            <Text className="text-primary-700 font-lato-bold">Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
}
