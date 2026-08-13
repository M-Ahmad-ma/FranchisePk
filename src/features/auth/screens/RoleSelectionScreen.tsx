import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { ArrowLeft, TrendingUp, Store, Check, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList, AuthRole } from '../../../shared/types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export function RoleSelectionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [selected, setSelected] = useState<AuthRole | null>(null);

  const reveal = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(
      90,
      reveal.map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [reveal]);

  const onSelect = (role: AuthRole) => {
    setSelected(role);
    cardScale.setValue(0.97);
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 5,
      tension: 140,
      useNativeDriver: true,
    }).start();
  };

  const onContinue = () => {
    if (!selected) return;
    navigation.replace('Login', { role: selected });
  };

  const fade = (i: number) => ({
    opacity: reveal[i],
    transform: [
      {
        translateY: reveal[i].interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  const selectedRole = ROLES.find((r) => r.key === selected);

  return (
    <View className="flex-1 bg-light" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FF" />

      {/* ambient decoration */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: height * 0.06,
          right: -width * 0.25,
          width: width * 0.6,
          height: width * 0.6,
          borderRadius: width * 0.3,
          backgroundColor: 'rgba(67,108,245,0.07)',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: -width * 0.3,
          left: -width * 0.22,
          width: width * 0.62,
          height: width * 0.62,
          borderRadius: width * 0.31,
          borderWidth: 1.5,
          borderColor: 'rgba(240,180,41,0.25)',
        }}
      />
      {/* diagonal seam */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: height * 0.4,
          left: -40,
          width: width + 80,
          height: 1,
          backgroundColor: 'rgba(67,108,245,0.08)',
          transform: [{ rotate: '-5deg' }],
        }}
      />

      <View className="flex-1 px-6 pb-8">
        {/* top bar */}
        <Animated.View
          style={fade(0)}
          className="flex-row items-center justify-between py-4"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            className="w-11 h-11 rounded-full border border-neutral-300 bg-white items-center justify-center"
          >
            <ArrowLeft size={20} color="#3F465C" />
          </TouchableOpacity>
          <Text className="text-neutral-500 font-lato-bold text-[11px] tracking-[3px] uppercase">
            Step 1 · Account
          </Text>
        </Animated.View>

        {/* headline */}
        <Animated.View style={fade(1)} className="mt-6">
          <Text className="text-primary-700 font-lato-bold text-xs tracking-[3px] uppercase mb-4">
            FranchisePk
          </Text>
          <Text className="text-neutral-900 font-lato-black text-[38px] leading-[44px]">
            Tell us who{'\n'}you are.
          </Text>
          <Text className="text-neutral-600 font-lato text-base leading-6 mt-4 max-w-[300px]">
            Choose the path that fits you — we'll tailor your experience from here.
          </Text>
        </Animated.View>

        {/* role cards */}
        <Animated.View style={fade(2)} className="flex-row gap-3.5 mt-8">
          {ROLES.map((role) => {
            const isActive = selected === role.key;
            const Icon = role.icon;
            const iconColor = isActive
              ? role.key === 'brand'
                ? '#3A2B00'
                : '#FFFFFF'
              : role.accent;
            return (
              <TouchableOpacity
                key={role.key}
                onPress={() => onSelect(role.key)}
                activeOpacity={0.85}
                className="flex-1 rounded-3xl overflow-hidden bg-white"
                style={{
                  borderWidth: 1.5,
                  borderColor: isActive ? role.accent : '#DAE2FD',
                  backgroundColor: isActive ? role.accentSoft : '#FFFFFF',
                }}
              >
                <View className="p-5 pb-6">
                  <View className="flex-row items-center justify-between mb-8">
                    <View
                      className="w-12 h-12 rounded-2xl items-center justify-center"
                      style={{ backgroundColor: isActive ? role.accent : '#EEF0FF' }}
                    >
                      <Icon size={24} color={iconColor} />
                    </View>
                    {isActive && (
                      <View
                        className="w-6 h-6 rounded-full items-center justify-center"
                        style={{ backgroundColor: role.accent }}
                      >
                        <Check
                          size={14}
                          color={role.key === 'brand' ? '#3A2B00' : '#FFFFFF'}
                          strokeWidth={3}
                        />
                      </View>
                    )}
                  </View>
                  <Text className="text-neutral-900 font-lato-black text-2xl leading-7">
                    {role.title}
                  </Text>
                  <Text className="font-lato text-sm mt-1" style={{ color: role.accent }}>
                    {role.tagline}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* continue */}
        <Animated.View style={fade(3)} className="flex-1 justify-end">
          <TouchableOpacity
            onPress={onContinue}
            activeOpacity={0.85}
            disabled={!selected}
            className="rounded-2xl py-4 items-center justify-center flex-row gap-2"
            style={{
              backgroundColor: selectedRole
                ? selectedRole.accent
                : '#DAE2FD',
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
            You can change this later from your profile.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
