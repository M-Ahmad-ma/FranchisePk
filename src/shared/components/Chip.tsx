import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Log } from '../utils/Log';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${selected ? 'bg-primary-700' : 'bg-neutral-200'
        }`}
    >
      <Text
        className={`text-sm font-lato ${selected ? 'text-primary-100' : 'text-neutral-700'
          }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;
