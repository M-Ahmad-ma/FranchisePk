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
import TeamCard from '../../franchise/components/TeamCard';
import BottomSheet from '../../../shared/components/BottomSheet';
import Button from '../../../shared/components/Button';
import { useTeam } from '../../../shared/hooks/useContent';
import { imageUrl } from '../../../shared/api/imageUrl';
import { Skeleton } from '../../../shared/components/Skeleton';
import { CheckCircle2, ChevronDown, Phone, Mail } from 'lucide-react-native';
import * as companyService from '../../../shared/api/companyService';
import type { TeamEmployee, Company, City } from '../../../shared/api/types';

export function TeamScreen() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamEmployee | null>(null);
  const { data, isLoading, isError } = useTeam();

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

  useEffect(() => {
    if (sheetVisible) {
      setSubmitted(false);
      setFormError('');
      if (cities.length === 0) {
        companyService.getCities().then((d) => {
          if (Array.isArray(d.cities)) setCities(d.cities);
        }).catch(() => { });
      }
      if (companies.length === 0) {
        companyService.getCompanies().then((d) => {
          if (Array.isArray(d.companies)) setCompanies(d.companies);
        }).catch(() => { });
      }
    }
  }, [sheetVisible, cities.length, companies.length]);

  const cityValue = (c: City): string =>
    String(c.id ?? c.co_city ?? c.name ?? '');

  const handleContact = (member: TeamEmployee) => {
    setSelectedMember(member);
    setSheetVisible(true);
  };

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
      await companyService.submitMoreInfo('investor', {
        firstname: firstName.trim(),
        lastname: lastName.trim(),
        email: email.trim(),
        number: number.trim(),
        city,
        co_id: brand.co_id,
        co_name: brand.co_name,
        message: message.trim(),
        lead_type: 'employee_contact',
      });
      setSubmitted(true);
    } catch (e: any) {
      setFormError(companyService.getMoreInfoErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    'bg-white rounded-2xl px-5 py-4 text-neutral-900 font-lato text-base border border-neutral-300';

  const memberName = (m: TeamEmployee) =>
    [m.u_firstname, m.u_lastname].filter(Boolean).join(' ').trim();

  const openLink = (url: string) => Linking.openURL(url).catch(() => { });

  return (
    <MainLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className='flex items-center justify-center py-9'>
          <View className='max-w-[300px]'>
            <Text className='text-center text-4xl font-lato-bold mb-4 text-primary-900'>Meet the Team</Text>
            <Text className='text-center text-lg font-lato'>Executive leadership and expansion specialists guiding your growth.</Text>
          </View>
        </View>

        <View className='px-4 pb-8'>
          <Text className='text-3xl font-lato-bold'>Our Team</Text>
          <Text className='font-lato text-lg mt-1 text-neutral-700'>The people behind Franchise Pakistan.</Text>

          {isLoading && (
            <View>
              {[0, 1, 2].map((i) => (
                <View key={i} className="bg-white rounded-lg p-4 mt-5">
                  <Skeleton className="w-full h-56 rounded-lg" />
                  <View className="mt-6 pb-1 border-b-[0.5px] border-b-primary-400">
                    <Skeleton className="w-1/2 h-6 mb-2" />
                    <Skeleton className="w-1/3 h-4" />
                  </View>
                  <View className="mt-5 flex-row items-center gap-4">
                    <Skeleton className="w-1/2 h-12 rounded-xl" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                  </View>
                </View>
              ))}
            </View>
          )}

          {isError && (
            <View className="items-center py-16">
              <Text className="text-neutral-500">Unable to load team members.</Text>
            </View>
          )}

          {data?.employee?.map((emp: TeamEmployee, i: number) => {
            const name = memberName(emp) || `Team Member ${i + 1}`;
            const role = emp.a_position || 'Team Member';
            const image = imageUrl(emp.u_image);

            return (
              <TeamCard
                key={emp.u_id || i}
                name={name}
                role={role}
                image={image ? { uri: image } : { uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' }}
                containerClassName='mt-5 bg-transparent'
                onContact={() => handleContact(emp)}
              />
            );
          })}

          {data && (!data.employee || data.employee.length === 0) && (
            <View className="items-center py-16">
              <Text className="text-neutral-500">No team members listed yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        {submitted ? (
          <View className="items-center py-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-5"
              style={{ backgroundColor: 'rgba(0,165,114,0.12)' }}
            >
              <CheckCircle2 size={40} color="#00A572" strokeWidth={2.2} />
            </View>
            <Text className="text-neutral-900 font-lato-black text-2xl mb-2">Request sent</Text>
            <Text className="text-neutral-600 font-lato text-sm leading-5 text-center mb-6">
              {memberName(selectedMember ?? ({} as TeamEmployee)) || 'Our team'} will get back to you
              shortly. Keep an eye on your inbox.
            </Text>
            <Button title="Done" onPress={() => setSheetVisible(false)} className="w-full" />
          </View>
        ) : (
          <>
            <Text className="text-xl font-lato-bold text-neutral-900 mb-1">
              Contact {memberName(selectedMember ?? ({} as TeamEmployee)) || 'Team Member'}
            </Text>
            <Text className="text-neutral-500 text-sm mb-1">{selectedMember?.a_position}</Text>
            <Text className="text-neutral-600 mb-5 mt-3">
              Send your details and our team will connect you with the right investment advisor.
            </Text>

            {(selectedMember?.u_email || selectedMember?.u_contact) && (
              <View className="flex-row flex-wrap gap-2 mb-5">
                {selectedMember?.u_contact && (
                  <TouchableOpacity
                    onPress={() => openLink(`tel:${String(selectedMember.u_contact).replace(/[^\d+]/g, '')}`)}
                    className="flex-row items-center gap-1.5 bg-primary-700 rounded-full px-3 py-1.5"
                  >
                    <Phone size={12} color="#FFFFFF" />
                    <Text className="text-white text-xs font-lato-bold">{selectedMember.u_contact}</Text>
                  </TouchableOpacity>
                )}
                {selectedMember?.u_email && String(selectedMember.u_email).includes('@') && (
                  <TouchableOpacity
                    onPress={() => openLink(`mailto:${selectedMember.u_email}`)}
                    className="flex-row items-center gap-1.5 bg-neutral-700 rounded-full px-3 py-1.5"
                  >
                    <Mail size={12} color="#FFFFFF" />
                    <Text className="text-white text-xs font-lato-bold">Email</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

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
                placeholder="Tell us a bit about your investment plans…"
                placeholderTextColor="#A3ABC4"
                multiline
                value={message}
                onChangeText={setMessage}
                className={`${field} min-h-[96px]`}
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            <Button
              title="Submit Request"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              className="w-full mt-6 py-3"
            />
          </>
        )}
      </BottomSheet>

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
