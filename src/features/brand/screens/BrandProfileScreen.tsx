import { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { HelpCircle, LogOut, Save, Camera } from 'lucide-react-native';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import Avatar from '../../../shared/components/Avatar';
import Button from '../../../shared/components/Button';
import { useAuth } from '../../../shared/auth/AuthContext';
import { imageUrl } from '../../../shared/api/imageUrl';
import { useBrandProfile, useUpdateBrandProfile } from '../../../shared/hooks/useBrand';
import { Skeleton } from '../../../shared/components/Skeleton';

const field =
  'bg-white rounded-2xl px-4 py-3.5 text-neutral-900 font-lato text-base border border-neutral-200';

export function BrandProfileScreen() {
  const { user, logout } = useAuth();
  const profileQuery = useBrandProfile();
  const updateMutation = useUpdateBrandProfile();

  const profile = profileQuery.data;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<Asset | null>(null);
  const [message, setMessage] = useState('');
  const [fieldError, setFieldError] = useState('');

  useEffect(() => {
    setFirstName(profile?.firstname ?? user?.name?.split(' ')[0] ?? '');
    setLastName(profile?.lastname ?? user?.name?.split(' ').slice(1).join(' ') ?? '');
    setEmail(profile?.email ?? user?.email ?? '');
    setContact(profile?.contact ?? user?.contact ?? '');
    setCompany(profile?.company ?? user?.company ?? '');
    setCity(profile?.city ?? user?.city ?? '');
  }, [profile, user]);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (asset?.uri) setImage(asset);
    });
  };

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ').trim() || user?.name || 'Brand Owner';
  const avatarUri = image?.uri ?? imageUrl(profile?.image ?? user?.image);
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setMessage('');
    setFieldError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setFieldError('First name, last name, and email are required.');
      return;
    }
    if (!password) {
      setFieldError('Password is required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('firstname', firstName.trim());
      formData.append('lastname', lastName.trim());
      formData.append('email', email.trim());
      formData.append('pass', password);
      if (contact.trim()) formData.append('contact', contact.trim());
      if (company.trim()) formData.append('company', company.trim());
      if (city.trim()) formData.append('city', city.trim());
      if (image?.uri) {
        formData.append('image', {
          uri: image.uri,
          name: image.fileName || 'photo.jpg',
          type: image.type || 'image/jpeg',
        } as any);
      }

      await updateMutation.mutateAsync(formData);
      setPassword('');
      setMessage('Profile updated.');
    } catch (e: any) {
      setMessage(e?.response?.data?.message || e?.message || 'Failed to save. Please try again.');
    }
  };

  return (
    <MainLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="items-center pt-8 pb-2 px-4">
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.7}>
            <View
              className="mb-4"
              style={{ elevation: 4, shadowColor: '#5279AC', shadowOpacity: 0.2, shadowRadius: 12, borderRadius: 999 }}
            >
              <Avatar
                source={avatarUri ? { uri: avatarUri } : undefined}
                size={88}
                initials={initials}
                className="bg-primary-700"
              />
              <View className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-700 items-center justify-center border-2 border-white">
                <Camera size={14} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-neutral-500 text-xs mt-0.5">Tap to change photo</Text>
          <Text className="text-neutral-900 text-2xl font-lato-bold mt-1">{displayName}</Text>
          <Text className="text-neutral-500 text-sm mt-1">{email || 'example@gmail.com'}</Text>
        </View>

        {profileQuery.isLoading ? (
          <View className="px-4 pt-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-full h-14 rounded-2xl" />
            ))}
          </View>
        ) : (
          <View className="px-4 pt-4">
            <Text className="text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase mb-3">
              Edit Profile
            </Text>

            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">First name</Text>
            <TextInput
              className={`${field} mb-4`}
              placeholder="First name"
              placeholderTextColor="#A3ABC4"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Last name</Text>
            <TextInput
              className={`${field} mb-4`}
              placeholder="Last name"
              placeholderTextColor="#A3ABC4"
              value={lastName}
              onChangeText={setLastName}
            />

            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Email</Text>
            <TextInput
              className={`${field} mb-4`}
              placeholder="Email address"
              placeholderTextColor="#A3ABC4"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Phone</Text>
            <TextInput
              className={`${field} mb-4`}
              placeholder="Phone number"
              placeholderTextColor="#A3ABC4"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={setContact}
            />

            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Company</Text>
            <TextInput
              className={`${field} mb-4`}
              placeholder="Brand / company name"
              placeholderTextColor="#A3ABC4"
              value={company}
              onChangeText={setCompany}
            />

            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">City</Text>
            <TextInput
              className={`${field} mb-4`}
              placeholder="City"
              placeholderTextColor="#A3ABC4"
              value={city}
              onChangeText={setCity}
            />

            <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Password</Text>
            <TextInput
              className={`${field} mb-6`}
              placeholder="Enter password"
              placeholderTextColor="#A3ABC4"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {fieldError ? (
              <Text className="text-red-500 text-sm text-center mb-3">{fieldError}</Text>
            ) : null}
            {message ? (
              <Text className="text-center text-sm font-lato mb-3 text-primary-700">{message}</Text>
            ) : null}

            <Button
              title="Save Changes"
              variant="primary"
              loading={updateMutation.isPending}
              onPress={handleSave}
              icon={<Save size={18} color="#FFFFFF" />}
              iconPosition="left"
              className="py-3.5"
            />
          </View>
        )}

        <View className="px-4 pt-8">
          <View className="bg-white rounded-2xl border border-neutral-200">
            <TouchableOpacity className="flex-row items-center px-5 py-4" activeOpacity={0.6}>
              <View className="w-10 h-10 rounded-xl bg-primary-200 items-center justify-center">
                <HelpCircle size={20} color="#5279AC" />
              </View>
              <Text className="flex-1 text-neutral-900 ml-3 font-lato text-base">Help & Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 pt-6">
          <Button
            title="Sign Out"
            variant="outlined"
            className="py-3.5"
            icon={<LogOut size={18} color="#5279AC" />}
            iconPosition="left"
            onPress={() => logout()}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
}
