import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList, AuthRole, RootStackParamList } from '../../../shared/types/navigation';
import { ArrowLeft, ArrowRight, TrendingUp, Store, Check } from 'lucide-react-native';

const ROLES: {
  key: AuthRole;
  title: string;
  tagline: string;
  description: string;
  icon: typeof TrendingUp;
  accent: string;
  accentSoft: string;
}[] = [
    {
      key: 'investor',
      title: 'Investor',
      tagline: 'I invest in franchises',
      description: 'Find vetted brands and fund your next high-growth venture.',
      icon: TrendingUp,
      accent: '#5279AC',
      accentSoft: 'rgba(67,108,245,0.08)',
    },
    {
      key: 'brand',
      title: 'Brand',
      tagline: 'I own a franchise',
      description: 'Raise capital, showcase your brand and meet qualified investors.',
      icon: Store,
      accent: '#FFB787',
      accentSoft: 'rgba(240,180,41,0.12)',
    },
  ];

export function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Signup'>>();
  const role = route.params?.role;
  const [selected, setSelected] = useState<AuthRole | null>(null);

  const goBackToHome = () => {
    const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    rootNav?.navigate('InvestorDrawer');
  };

  const onContinue = () => {
    if (!selected) return;
    if (selected === 'brand') {
      navigation.replace('BrandSignup', { role: 'brand' });
    } else {
      navigation.replace('InvestorGetStarted');
    }
  };

  const selectedRole = ROLES.find((r) => r.key === selected);

  return (
    <AuthLayout>
      <ScrollView
        className="flex-1 px-6 pt-20"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 32 }}
      >
        <View className="mb-8">
          <TouchableOpacity
            onPress={goBackToHome}
            activeOpacity={0.7}
            className="self-start mb-6"
          >
            <View className="w-11 h-11 rounded-full bg-white border border-neutral-200 items-center justify-center">
              <ArrowLeft size={20} color="#3F465C" />
            </View>
          </TouchableOpacity>
          <Text className="text-center text-primary-900 text-3xl font-lato-bold">Franchise Pakistan</Text>
          <Text className="text-center text-neutral-600 text-base mt-1">
            Premium access to global expansion.
          </Text>
        </View>

        <Text className="text-neutral-900 font-lato-black text-2xl mb-1">
          How would you like to join?
        </Text>
        <Text className="text-neutral-600 font-lato text-sm mb-6">
          {role ? `Creating a ${role} account.` : 'Choose the path that fits you.'}
        </Text>

        <View className="flex-row gap-3.5">
          {ROLES.map((r) => {
            const isActive = selected === r.key;
            const Icon = r.icon;
            const iconColor = isActive
              ? r.key === 'brand'
                ? '#3A2B00'
                : '#FFFFFF'
              : r.accent;
            return (
              <TouchableOpacity
                key={r.key}
                onPress={() => setSelected(r.key)}
                activeOpacity={0.85}
                className="flex-1 rounded-3xl overflow-hidden bg-white"
                style={{
                  borderWidth: 1.5,
                  borderColor: isActive ? r.accent : '#DAE2FD',
                  backgroundColor: isActive ? r.accentSoft : '#FFFFFF',
                }}
              >
                <View className="p-5 pb-6">
                  <View className="flex-row items-center justify-between mb-8">
                    <View
                      className="w-12 h-12 rounded-2xl items-center justify-center"
                      style={{ backgroundColor: isActive ? r.accent : '#EEF0FF' }}
                    >
                      <Icon size={24} color={iconColor} />
                    </View>
                    {isActive && (
                      <View
                        className="w-6 h-6 rounded-full items-center justify-center"
                        style={{ backgroundColor: r.accent }}
                      >
                        <Check
                          size={14}
                          color={r.key === 'brand' ? '#3A2B00' : '#FFFFFF'}
                          strokeWidth={3}
                        />
                      </View>
                    )}
                  </View>
                  <Text className="text-neutral-900 font-lato-black text-2xl leading-7">
                    {r.title}
                  </Text>
                  <Text className="font-lato text-sm mt-1" style={{ color: r.accent }}>
                    {r.tagline}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={onContinue}
          activeOpacity={0.85}
          disabled={!selected}
          className="rounded-2xl py-4 items-center justify-center flex-row gap-2 mt-8"
          style={{
            backgroundColor: selectedRole ? selectedRole.accent : '#DAE2FD',
            minHeight: 56,
          }}
        >
          <Text
            className="font-lato-bold text-base"
            style={{
              color: selectedRole
                ? selectedRole.key === 'brand'
                  ? '#3A2B00'
                  : '#FFFFFF'
                : '#6F778E',
            }}
          >
            {selected ? `Continue as ${selectedRole?.title}` : 'Select a role'}
          </Text>
          <ArrowRight
            size={18}
            color={
              selectedRole
                ? selectedRole.key === 'brand'
                  ? '#3A2B00'
                  : '#FFFFFF'
                : '#6F778E'
            }
            strokeWidth={2.5}
          />
        </TouchableOpacity>

        <Text className="text-neutral-400 font-lato text-xs text-center mt-4">
          Investors can browse instantly — a brand account needs sign up.
        </Text>
      </ScrollView>
    </AuthLayout>
  );
}
