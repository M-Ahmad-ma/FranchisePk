import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import {
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';
import { CheckCircle2, Camera, X } from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import { useAddProperty } from '../../../shared/hooks/useProperties';

interface AddPropertySheetProps {
  onClose: () => void;
}

const field =
  'bg-white rounded-2xl px-5 py-4 text-neutral-900 font-lato text-base border border-neutral-300';

function AddPropertySheet({ onClose }: AddPropertySheetProps) {
  const [propertyName, setPropertyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [size, setSize] = useState('');
  const [floor, setFloor] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<Asset | null>(null);
  const [formError, setFormError] = useState('');

  const addProperty = useAddProperty();
  const submitting = addProperty.isPending;
  const submitted = addProperty.isSuccess;

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (asset?.uri) setImage(asset);
    });
  };

  const handleSubmit = () => {
    setFormError('');
    if (!propertyName.trim()) {
      setFormError('Property name is required.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Phone number is required.');
      return;
    }
    addProperty.mutate(
      {
        fields: {
          propertyName: propertyName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          size: size.trim(),
          floor: floor.trim(),
          s_address: address.trim(),
          m_message: message.trim(),
        },
        image:
          image?.uri && image.fileName && image.type
            ? { uri: image.uri, name: image.fileName, type: image.type }
            : undefined,
      },
      {
        onError: () =>
          setFormError('Something went wrong. Please try again.'),
      },
    );
  };

  const resetAndClose = () => {
    addProperty.reset();
    onClose();
  };

  if (submitted) {
    return (
      <View className="items-center py-6">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-5"
          style={{ backgroundColor: 'rgba(0,165,114,0.12)' }}>
          <CheckCircle2 size={40} color="#00A572" strokeWidth={2.2} />
        </View>
        <Text className="text-neutral-900 font-lato-black text-2xl mb-2">
          Property submitted
        </Text>
        <Text className="text-neutral-600 font-lato text-sm leading-5 text-center mb-6">
          Your property has been submitted for review. Our team will get in
          touch with you shortly.
        </Text>
        <Button title="Done" onPress={resetAndClose} className="w-full" />
      </View>
    );
  }

  return (
    <>
      <Text className="text-xl font-lato-bold text-neutral-900 mb-2">
        List Your Property
      </Text>
      <Text className="text-neutral-600 mb-5">
        Fill in your property details and our team will connect you with
        qualified global investors.
      </Text>

      {formError ? (
        <Text className="text-red-500 text-sm font-lato mb-3">{formError}</Text>
      ) : null}

      <View>
        <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
          Property name
        </Text>
        <TextInput
          placeholder="e.g. Shiraz Agora"
          placeholderTextColor="#A3ABC4"
          value={propertyName}
          onChangeText={setPropertyName}
          className={field}
        />
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
            Email address
          </Text>
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
        <View className="flex-1">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
            Phone number
          </Text>
          <TextInput
            placeholder="03001234567"
            placeholderTextColor="#A3ABC4"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            className={field}
          />
        </View>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
            City
          </Text>
          <TextInput
            placeholder="Peshawar"
            placeholderTextColor="#A3ABC4"
            value={city}
            onChangeText={setCity}
            className={field}
          />
        </View>
        <View className="flex-1">
          <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
            Shop size
          </Text>
          <TextInput
            placeholder="1200 sq ft"
            placeholderTextColor="#A3ABC4"
            value={size}
            onChangeText={setSize}
            className={field}
          />
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
          Shop floor
        </Text>
        <TextInput
          placeholder="Basement, ground floor, upper floor"
          placeholderTextColor="#A3ABC4"
          value={floor}
          onChangeText={setFloor}
          className={field}
        />
      </View>

      <View className="mt-4">
        <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
          Complete address
        </Text>
        <TextInput
          placeholder="Main University Road Peshawar"
          placeholderTextColor="#A3ABC4"
          value={address}
          onChangeText={setAddress}
          className={field}
        />
      </View>

      <View className="mt-4">
        <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
          Additional details{' '}
          <Text className="text-neutral-500 font-lato">(optional)</Text>
        </Text>
        <TextInput
          placeholder="Tell us about the property…"
          placeholderTextColor="#A3ABC4"
          multiline
          value={message}
          onChangeText={setMessage}
          className={`${field} min-h-[96px]`}
          style={{ textAlignVertical: 'top' }}
        />
      </View>

      <View className="mt-4">
        <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">
          Photo <Text className="text-neutral-500 font-lato">(optional)</Text>
        </Text>
        {image?.uri ? (
          <View className="flex-row items-center gap-3">
            <Image source={{ uri: image.uri }} className="w-16 h-16 rounded-xl" />
            <TouchableOpacity
              onPress={() => setImage(null)}
              activeOpacity={0.8}
              className="flex-row items-center gap-1.5">
              <X size={16} color="#E11D48" />
              <Text className="text-red-500 font-lato-bold text-sm">Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handlePickImage}
            activeOpacity={0.8}
            className={`${field} flex-row items-center justify-center gap-2 border-dashed`}>
            <Camera size={20} color="#8990A8" />
            <Text className="text-neutral-600 font-lato text-base">
              Add a photo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Button
        title="Submit Property"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting}
        className="w-full mt-6 py-3"
      />
    </>
  );
}

export default AddPropertySheet;
