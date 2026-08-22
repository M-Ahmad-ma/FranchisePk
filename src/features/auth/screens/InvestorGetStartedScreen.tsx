import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList, RootStackParamList } from '../../../shared/types/navigation';
import { ArrowLeft, Store, CheckCircle2, ChevronDown, ArrowRight } from 'lucide-react-native';
import * as companyService from '../../../shared/api/companyService';
import { useAuth } from '../../../shared/auth/AuthContext';
import type { Company, City } from '../../../shared/api/types';

export function InvestorGetStartedScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { enterAsGuest } = useAuth();

  const goToInvestorFlow = () => {
    const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    enterAsGuest();
    rootNav?.reset({ index: 0, routes: [{ name: 'InvestorDrawer' }] });
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');

  const [cities, setCities] = useState<City[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState<Company | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [dropdown, setDropdown] = useState<'city' | 'brand' | null>(null);

  useEffect(() => {
    companyService.getCities().then((d) => {
      if (Array.isArray(d.cities)) setCities(d.cities);
    }).catch(() => {});
    companyService.getCompanies().then((d) => {
      if (Array.isArray(d.companies)) setCompanies(d.companies);
    }).catch(() => {});
  }, []);

  const cityValue = (c: City): string =>
    String(c.id ?? c.co_city ?? c.name ?? '');

  const handleSubmit = async () => {
    setError('');
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please enter your name and email.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!number.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (!city) {
      setError('Please select your city.');
      return;
    }
    if (!brand) {
      setError('Please select a brand you are interested in.');
      return;
    }
    setLoading(true);
    try {
      await companyService.submitMoreInfo('investor', {
        firstname: firstName.trim(),
        lastname: lastName.trim(),
        email: email.trim(),
        number: number.trim(),
        city,
        co_id: brand.co_id,
        co_name: brand.co_name,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (e: any) {
      setError(companyService.getMoreInfoErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const field =
    'bg-white rounded-2xl px-5 py-4 text-neutral-900 font-lato text-base border border-neutral-300';

  if (submitted) {
    return (
      <View
        className="flex-1 bg-light items-center justify-center px-8"
        style={{ paddingTop: insets.top }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#FAF8FF" />
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: 'rgba(0,165,114,0.12)' }}
        >
          <CheckCircle2 size={48} color="#00A572" strokeWidth={2.2} />
        </View>
        <Text className="text-neutral-900 font-lato-black text-[34px] leading-[40px] text-center">
          Request sent
        </Text>
        <Text className="text-neutral-600 font-lato text-base leading-6 mt-3 text-center mb-10">
          Our team will connect you with{' '}
          <Text className="text-neutral-900 font-lato-bold">{brand?.co_name}</Text>.
          Keep an eye on your inbox.
        </Text>
        <TouchableOpacity
          onPress={goToInvestorFlow}
          activeOpacity={0.85}
          className="bg-primary-700 rounded-2xl py-4 w-full items-center justify-center flex-row gap-2"
        >
          <Text className="text-white font-lato-bold text-base">Browse Franchises</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

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

      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* top bar */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity
            onPress={() => navigation.replace('Signup')}
            activeOpacity={0.7}
            className="flex-row items-center gap-2"
          >
            <View className="w-11 h-11 rounded-full border border-neutral-300 bg-white items-center justify-center">
              <ArrowLeft size={20} color="#3F465C" />
            </View>
            <Text className="text-neutral-500 font-lato-bold text-sm">Change role</Text>
          </TouchableOpacity>
          <Text className="text-neutral-500 font-lato-bold text-[11px] tracking-[3px] uppercase">
            Step 2 · Investor
          </Text>
        </View>

        {/* headline */}
        <View className="mt-2 mb-7">
          <Text className="text-primary-700 font-lato-bold text-xs tracking-[3px] uppercase mb-4">
            Franchise Pakistan
          </Text>
          <Text className="text-neutral-900 font-lato-black text-[34px] leading-[40px]">
            Get started{'\n'}as an investor
          </Text>
          <Text className="text-neutral-600 font-lato text-base leading-6 mt-3 max-w-[320px]">
            Tell us about yourself and the brands you're interested in — we'll
            match you with vetted opportunities.
          </Text>
        </View>

        {error ? (
          <Text className="text-red-500 text-sm font-lato mb-3">{error}</Text>
        ) : null}

        {/* name */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">First name</Text>
            <TextInput
              placeholder="Ali"
              placeholderTextColor="#A3ABC4"
              value={firstName}
              onChangeText={setFirstName}
              className={field}
            />
          </View>
          <View className="flex-1">
            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Last name</Text>
            <TextInput
              placeholder="Khan"
              placeholderTextColor="#A3ABC4"
              value={lastName}
              onChangeText={setLastName}
              className={field}
            />
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Email address</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#A3ABC4"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            className={field}
          />
        </View>

        <View className="mt-4">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Phone number</Text>
          <TextInput
            placeholder="03001234567"
            placeholderTextColor="#A3ABC4"
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
            className={field}
          />
        </View>

        {/* city picker */}
        <View className="mt-4">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Your city</Text>
          <TouchableOpacity
            onPress={() => setDropdown('city')}
            activeOpacity={0.8}
            className={`${field} flex-row items-center justify-between`}
          >
            <Text className={city ? 'text-neutral-900' : 'text-neutral-600'}>
              {city || 'Select city'}
            </Text>
            <ChevronDown size={18} color="#8990A8" />
          </TouchableOpacity>
        </View>

        {/* brand picker */}
        <View className="mt-4">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
            Brand you're interested in
          </Text>
          <TouchableOpacity
            onPress={() => setDropdown('brand')}
            activeOpacity={0.8}
            className={`${field} flex-row items-center justify-between`}
          >
            <View className="flex-1 flex-row items-center gap-2">
              {brand && (
                <View className="w-7 h-7 rounded-lg bg-primary-200 items-center justify-center">
                  <Store size={14} color="#5279AC" />
                </View>
              )}
              <Text
                className={brand ? 'text-neutral-900' : 'text-neutral-600'}
                numberOfLines={1}
              >
                {brand ? brand.co_name : 'Select a brand'}
              </Text>
            </View>
            <ChevronDown size={18} color="#8990A8" />
          </TouchableOpacity>
        </View>

        {/* message */}
        <View className="mt-4">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
            Message <Text className="text-neutral-500 font-lato">(optional)</Text>
          </Text>
          <TextInput
            placeholder="Tell us a bit about your investment plans…"
            placeholderTextColor="#A3ABC4"
            multiline
            value={message}
            onChangeText={setMessage}
            className={`${field} min-h-[96px] text-left align-top`}
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
          className="bg-primary-700 rounded-2xl py-4 mt-7 items-center justify-center flex-row gap-2"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text className="text-white font-lato-bold text-base">Submit Request</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
        <Text className="text-neutral-400 font-lato text-xs text-center mt-4">
          No account needed — we'll get back to you directly.
        </Text>
      </ScrollView>

      {/* picker modal */}
      <Modal visible={dropdown !== null} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center px-6"
          activeOpacity={1}
          onPress={() => setDropdown(null)}
        >
          <View className="bg-white rounded-3xl p-4 max-h-[70%]">
            <Text className="text-neutral-900 font-lato-bold text-base px-2 pt-2 pb-1">
              {dropdown === 'city' ? 'Select your city' : 'Select a brand'}
            </Text>
            {dropdown === 'brand' && companies.length === 0 ? (
              <View className="items-center py-8">
                <ActivityIndicator color="#436CF5" />
              </View>
            ) : (
              <FlatList
                data={dropdown === 'city' ? (cities as any[]) : (companies as any[])}
                keyExtractor={(item, i) =>
                  String(dropdown === 'city' ? item.id ?? i : item.co_id)
                }
                showsVerticalScrollIndicator={false}
                renderItem={({ item }: any) => {
                  const isCity = dropdown === 'city';
                  const label = isCity ? cityValue(item) : item.co_name;
                  const selected = isCity
                    ? city === cityValue(item)
                    : brand?.co_id === item.co_id;
                  return (
                    <TouchableOpacity
                      className="py-3 border-b border-neutral-200"
                      onPress={() => {
                        if (isCity) {
                          setCity(cityValue(item));
                        } else {
                          setBrand(item as Company);
                        }
                        setDropdown(null);
                      }}
                    >
                      <Text
                        className={selected ? 'text-primary-700 font-lato-bold' : 'text-neutral-900'}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <TouchableOpacity
              className="mt-2 py-2 items-center"
              onPress={() => setDropdown(null)}
            >
              <Text className="text-primary-700 font-lato-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}