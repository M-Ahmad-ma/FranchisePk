import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { ArrowLeft, Mail, ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../shared/types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STEP_LABELS = ['Email', 'Code', 'Password'];
const BRAND = '#BC5D00';

function generateCode() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

export function BrandForgotPasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [actualCode, setActualCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const reveal = useRef(new Animated.Value(0)).current;
  const otpRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    reveal.setValue(0);
    Animated.timing(reveal, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [step, reveal]);

  const digits = Array.from({ length: 6 }, (_, i) => code[i] ?? '');

  const handleSend = () => {
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setActualCode(generateCode());
    setCode('');
    setStep(1);
  };

  const handleVerify = () => {
    setError('');
    if (code.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    if (code !== actualCode) {
      setError("That code doesn't match. Please check and try again.");
      return;
    }
    setPassword('');
    setConfirm('');
    setStep(2);
  };

  const handleReset = () => {
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setStep(3);
  };

  const onOtpChange = (text: string, index: number) => {
    const next = text.replace(/\D/g, '');
    const chars = (code + next).split('');
    chars[index] = next.length ? next.slice(-1) : '';
    const joined = chars.join('').slice(0, 6);
    setCode(joined);
    if (next && index < 5) otpRefs.current[index + 1]?.focus();
    if (joined.length === 6) otpRefs.current[5]?.blur();
  };

  const onOtpKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const field =
    'bg-white rounded-2xl px-5 py-4 text-neutral-900 font-lato text-base border';

  return (
    <View className="flex-1 bg-light" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8FF" />

      {/* top bar */}
      <View className="flex-row items-center justify-between px-6 pt-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          className="w-11 h-11 rounded-full border border-neutral-300 items-center justify-center"
        >
          <ArrowLeft size={20} color="#3F465C" />
        </TouchableOpacity>
        {step < 3 && (
          <View className="flex-row items-center gap-2.5">
            {STEP_LABELS.map((label, i) => (
              <View key={label} className="flex-row items-center gap-2.5">
                {i > 0 && (
                  <View
                    className="h-[1px]"
                    style={{
                      width: 18,
                      backgroundColor: i <= step ? BRAND : '#DAE2FD',
                    }}
                  />
                )}
                <Text
                  className="font-lato-bold text-[11px] tracking-[1px] uppercase"
                  style={{ color: i <= step ? BRAND : '#BEC6E0' }}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        )}
        {step === 3 && (
          <Text className="font-lato-bold text-[11px] tracking-[1px] uppercase text-[#00A572]">
            Complete
          </Text>
        )}
      </View>

      <Animated.View
        style={{
          opacity: reveal,
          transform: [
            {
              translateY: reveal.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
        className="flex-1 px-6 justify-center pb-12"
      >
        {step === 0 && (
          <>
            <View className="w-16 h-16 rounded-2xl bg-secondary-700 items-center justify-center mb-7">
              <Mail size={28} color="#FFFFFF" />
            </View>
            <Text className="text-neutral-900 font-lato-black text-[34px] leading-[40px]">
              Forgot your{'\n'}password?
            </Text>
            <Text className="text-neutral-600 font-lato text-base leading-6 mt-3 mb-9">
              Enter the email linked to your brand account and we'll send you a
              verification code to reset it.
            </Text>

            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#A3ABC4"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError('');
              }}
              className={`${field} border-neutral-300 mb-2`}
            />

            {error ? (
              <Text className="text-red-500 text-sm font-lato mb-2">{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.85}
              className="bg-secondary-700 rounded-2xl py-4 mt-2 items-center justify-center flex-row gap-2"
            >
              <Text className="text-white font-lato-bold text-base">Send Reset Code</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        )}

        {step === 1 && (
          <>
            <View className="w-16 h-16 rounded-2xl bg-secondary-700 items-center justify-center mb-7">
              <ShieldCheck size={28} color="#FFFFFF" />
            </View>
            <Text className="text-neutral-900 font-lato-black text-[34px] leading-[40px]">
              Enter the code
            </Text>
            <Text className="text-neutral-600 font-lato text-base leading-6 mt-3 mb-8">
              We sent a 6-digit code to{' '}
              <Text className="text-neutral-900 font-lato-bold">{email}</Text>.{' '}
              Demo code:{' '}
              <Text className="text-secondary-700 font-lato-bold tracking-widest">
                {actualCode}
              </Text>
            </Text>

            <View className="flex-row gap-2.5 mb-2">
              {digits.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  value={digit}
                  onChangeText={(t) => onOtpChange(t, i)}
                  onKeyPress={(e) => onOtpKeyPress(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className="flex-1 h-14 rounded-2xl text-center font-lato-bold text-xl text-neutral-900"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: code[i] ? BRAND : '#DAE2FD',
                  }}
                />
              ))}
            </View>

            {error ? (
              <Text className="text-red-500 text-sm font-lato mb-2">{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleVerify}
              activeOpacity={0.85}
              disabled={code.length !== 6}
              className="bg-secondary-700 rounded-2xl py-4 mt-2 items-center justify-center flex-row gap-2"
              style={{ opacity: code.length === 6 ? 1 : 0.5 }}
            >
              <Text className="text-white font-lato-bold text-base">Verify Code</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <View className="w-16 h-16 rounded-2xl bg-secondary-700 items-center justify-center mb-7">
              <Lock size={28} color="#FFFFFF" />
            </View>
            <Text className="text-neutral-900 font-lato-black text-[34px] leading-[40px]">
              Choose a new{'\n'}password
            </Text>
            <Text className="text-neutral-600 font-lato text-base leading-6 mt-3 mb-9">
              Make it at least 6 characters — something memorable but not guessable.
            </Text>

            <TextInput
              placeholder="New password"
              placeholderTextColor="#A3ABC4"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError('');
              }}
              className={`${field} border-neutral-300 mb-3`}
            />
            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor="#A3ABC4"
              secureTextEntry
              autoCapitalize="none"
              value={confirm}
              onChangeText={(t) => {
                setConfirm(t);
                setError('');
              }}
              className={`${field} border-neutral-300 mb-2`}
            />

            {error ? (
              <Text className="text-red-500 text-sm font-lato mb-2">{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleReset}
              activeOpacity={0.85}
              className="bg-secondary-700 rounded-2xl py-4 mt-2 items-center justify-center flex-row gap-2"
            >
              <Text className="text-white font-lato-bold text-base">Reset Password</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <View className="items-center">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-8"
              style={{ backgroundColor: 'rgba(0,165,114,0.12)' }}
            >
              <CheckCircle2 size={48} color="#00A572" strokeWidth={2.2} />
            </View>
            <Text className="text-neutral-900 font-lato-black text-[34px] leading-[40px] text-center">
              Password updated
            </Text>
            <Text className="text-neutral-600 font-lato text-base leading-6 mt-3 text-center mb-10">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.popTo('BrandLogin')}
              activeOpacity={0.85}
              className="bg-secondary-700 rounded-2xl py-4 w-full items-center justify-center"
            >
              <Text className="text-white font-lato-bold text-base">Back to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
