import { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  Linking,
} from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import MapView from '../../../shared/components/MapView';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  Building2,
  ChevronRight,
} from 'lucide-react-native';
import * as companyService from '../../../shared/api/companyService';
import type { Company, City } from '../../../shared/api/types';

interface Office {
  id: string;
  type: 'head' | 'branch';
  title: string;
  address: string;
  phone: string;
  phoneAlt?: string;
  whatsapp?: string;
  email: string;
  latitude: number;
  longitude: number;
}

const OFFICES: Office[] = [
  {
    id: 'peshawar',
    type: 'head',
    title: 'Peshawar Office',
    address: 'Office #1, First Floor, Iman Apartment, Civil Quarters, Kohat Road, Peshawar',
    phone: '+92 301 8727202',
    whatsapp: '+92 301 8727202',
    email: 'info@franchisepk.com',
    latitude: 34.0151,
    longitude: 71.5249,
  },
  {
    id: 'lahore',
    type: 'branch',
    title: 'Lahore Office',
    address: 'Office #1, First Floor, Mahmood Pharmacy Ikram Center, Opposite Eden Avenue, New Airport Road, Lahore',
    phone: '+92 326 8336229',
    phoneAlt: '+92 300 9080516',
    whatsapp: '+92 326 8336229',
    email: 'info@franchisepk.com',
    latitude: 31.5204,
    longitude: 74.3587,
  },
  {
    id: 'islamabad',
    type: 'head',
    title: 'Islamabad Office',
    address: 'Hill Plaza, Office 16, 2nd Floor, Jinnah Avenue, Blue Area, Islamabad',
    phone: '0301 3103070',
    phoneAlt: '0301 3103070',
    whatsapp: '0301 3103070',
    email: 'info@franchisepk.com',
    latitude: 33.7147,
    longitude: 73.0663,
  },
];

export function ContactUs() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState<Company | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [dropdown, setDropdown] = useState<'city' | 'brand' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<Office>(OFFICES[0]);

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

  const field =
    'bg-white rounded-2xl px-5 py-4 text-neutral-900 font-lato text-base border border-neutral-300';

  const handleSubmit = async () => {
    setFormError('');
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!number.trim()) {
      setFormError('Please enter your phone number.');
      return;
    }
    if (!city) {
      setFormError('Please select your city.');
      return;
    }
    if (!brand) {
      setFormError('Please select a brand you are interested in.');
      return;
    }
    setSubmitting(true);
    try {
      await companyService.submitMoreInfo('expert', {
        firstname: firstName.trim(),
        lastname: lastName.trim(),
        email: email.trim(),
        number: number.trim(),
        city,
        co_id: brand.co_id,
        co_name: brand.co_name,
        message: message.trim(),
        lead_type: 'ask-the-expert',
      });
      setSubmitted(true);
    } catch (e: any) {
      setFormError(companyService.getMoreInfoErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const openLink = (url: string) => Linking.openURL(url).catch(() => {});

  return (
    <MainLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex items-center justify-center py-9">
          <View className="max-w-[300px]">
            <Text className="text-center text-4xl font-lato-bold mb-4 text-primary-900">
              Get in Touch
            </Text>
            <Text className="text-center text-lg font-lato">
              Have a question? Reach out to our experts — we're here to guide your expansion.
            </Text>
          </View>
        </View>

        {/* Offices */}
        <View className="mt-2 px-4">
          <Text className="text-2xl font-lato-bold text-neutral-900">Our Offices</Text>
          <Text className="text-neutral-600 font-lato text-sm mt-1 mb-4">
            Select an office to view its location on the map.
          </Text>

          {OFFICES.map((office) => {
            const active = selectedOffice.id === office.id;
            return (
              <TouchableOpacity
                key={office.id}
                onPress={() => setSelectedOffice(office)}
                activeOpacity={0.8}
                className={`mb-3 rounded-2xl border p-4 ${active ? 'border-primary-700 bg-secondary-200' : 'border-neutral-200 bg-white'}`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-primary-700 items-center justify-center">
                    <Building2 size={18} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 font-lato-bold">
                      {office.type === 'head' ? 'Head Office' : 'Branch Office'}
                    </Text>
                    <Text className="text-neutral-900 font-lato-bold text-base">{office.title}</Text>
                  </View>
                  <ChevronRight size={18} color={active ? '#436CF5' : '#A3ABC4'} />
                </View>

                <View className="mt-3 flex-row items-start gap-2">
                  <MapPin size={15} color="#8990A8" style={{ marginTop: 2 }} />
                  <Text className="text-neutral-600 font-lato text-sm flex-1">{office.address}</Text>
                </View>

                <View className="mt-3 flex-row flex-wrap gap-2">
                  <TouchableOpacity
                    onPress={() => openLink(`tel:${office.phone.replace(/\s+/g, '')}`)}
                    className="flex-row items-center gap-1.5 bg-primary-700 rounded-full px-3 py-1.5"
                  >
                    <Phone size={12} color="#FFFFFF" />
                    <Text className="text-white text-xs font-lato-bold">{office.phone}</Text>
                  </TouchableOpacity>
                  {office.whatsapp && (
                    <TouchableOpacity
                      onPress={() => openLink(`https://wa.me/${office.whatsapp?.replace(/\D/g, '')}`)}
                      className="flex-row items-center gap-1.5 bg-primary-700 rounded-full px-3 py-1.5"
                    >
                      <MessageCircle size={12} color="#FFFFFF" />
                      <Text className="text-white text-xs font-lato-bold">WhatsApp</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => openLink(`mailto:${office.email}`)}
                    className="flex-row items-center gap-1.5 bg-neutral-700 rounded-full px-3 py-1.5"
                  >
                    <Mail size={12} color="#FFFFFF" />
                    <Text className="text-white text-xs font-lato-bold">Email</Text>
                  </TouchableOpacity>
                </View>
                {office.phoneAlt && (
                  <Text className="text-neutral-500 text-xs font-lato mt-2">
                    Alt: {office.phoneAlt}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="px-4 mt-4">
          <MapView
            latitude={selectedOffice.latitude}
            longitude={selectedOffice.longitude}
            title={selectedOffice.title}
            height={280}
          />
        </View>

        {/* Ask the Experts */}
        <View className="px-4 mt-10 mb-8">
          <Text className="text-2xl font-lato-bold text-neutral-900">Ask the Experts</Text>
          <Text className="text-neutral-600 font-lato text-sm mt-1 mb-5">
            Didn't find what you want? Send us your details and our team will get back to you.
          </Text>

          {submitted ? (
            <View className="items-center py-8 bg-white rounded-2xl border border-neutral-200 px-6">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(0,165,114,0.12)' }}
              >
                <CheckCircle2 size={40} color="#00A572" strokeWidth={2.2} />
              </View>
              <Text className="text-neutral-900 font-lato-black text-2xl mb-2">Request sent</Text>
              <Text className="text-neutral-600 font-lato text-sm leading-5 text-center">
                Our experts will get back to you shortly. Keep an eye on your inbox.
              </Text>
            </View>
          ) : (
            <>
              {formError ? (
                <Text className="text-red-500 text-sm font-lato mb-3">{formError}</Text>
              ) : null}

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

              <View className="mt-4">
                <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
                  Brand you're interested in
                </Text>
                <TouchableOpacity
                  onPress={() => setDropdown('brand')}
                  activeOpacity={0.8}
                  className={`${field} flex-row items-center justify-between`}
                >
                  <Text className={brand ? 'text-neutral-900' : 'text-neutral-600'} numberOfLines={1}>
                    {brand ? brand.co_name : 'Select a brand'}
                  </Text>
                  <ChevronDown size={18} color="#8990A8" />
                </TouchableOpacity>
              </View>

              <View className="mt-4">
                <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
                  Message <Text className="text-neutral-500 font-lato">(optional)</Text>
                </Text>
                <TextInput
                  placeholder="Tell us a bit about your plans…"
                  placeholderTextColor="#A3ABC4"
                  multiline
                  value={message}
                  onChangeText={setMessage}
                  className={`${field} min-h-[96px]`}
                  style={{ textAlignVertical: 'top' }}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.85}
                className="bg-primary-700 rounded-2xl py-4 mt-6 items-center justify-center"
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-lato-bold text-base">Submit Request</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
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
                      <Text className={selected ? 'text-primary-700 font-lato-bold' : 'text-neutral-900'}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <TouchableOpacity className="mt-2 py-2 items-center" onPress={() => setDropdown(null)}>
              <Text className="text-primary-700 font-lato-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </MainLayout>
  );
}