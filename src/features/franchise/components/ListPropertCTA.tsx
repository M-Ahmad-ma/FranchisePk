import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowRight, HousePlus } from 'lucide-react-native';
import BottomSheet from '../../../shared/components/BottomSheet';
import Button from '../../../shared/components/Button';

interface ListPropertyCTAProps {
  onPress?: () => void;
  containerClassName?: string;
}

const ListPropertyCTA: React.FC<ListPropertyCTAProps> = ({
  onPress,
  containerClassName = '',
}) => {
  const [sheetVisible, setSheetVisible] = useState(false);

  const handlePress = () => {
    onPress?.();
    setSheetVisible(true);
  };

  return (
    <View
      className={`bg-[#EDF0FF] mb-4 rounded-2xl  p-6 mx-4 shadow-md ${containerClassName}`}
    >

      <View className='bg-secondary-300 w-16 flex items-center p-4 rounded-full'>
        <HousePlus color="#2151DA" />
      </View>
      {/* Title */}
      <Text className="text-2xl font-lato-bold mt-3 text-primary-900 mb-2">
        List Your Property
      </Text>
      {/* Description */}
      <Text className="text-lg text-neutral-800 font-lato leading-5 mb-5">
        Unlock premium visibility for your commercial assets and connect with
        qualified global investors.
      </Text>

      {/* Button */}
      <TouchableOpacity
        onPress={handlePress}
        className="bg-primary-700 py-3 px-6 rounded-full self-start flex-row items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white font-lato-bold text-base mr-2">
          Start Onboarding
        </Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <Text className="text-xl font-lato-bold text-neutral-900 mb-2">Submit Request</Text>
        <Text className="text-neutral-600 mb-6">Fill in your details to submit a franchise inquiry request for</Text>
        <Button title="Submit" onPress={() => setSheetVisible(false)} />
      </BottomSheet>
    </View>
  );
};

export default ListPropertyCTA;
