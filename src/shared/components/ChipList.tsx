import React from 'react';
import { ScrollView, View } from 'react-native';
import Chip from './Chip';

interface ChipItem {
  id: string;
  label: string;
}

interface ChipListProps {
  items: ChipItem[];
  selectedId?: string | null;
  onSelect?: (item: ChipItem) => void;
  className?: string;
  containerClassName?: string;
  chipProps?: Partial<React.ComponentProps<typeof Chip>>;
}

const ChipList: React.FC<ChipListProps> = ({
  items = [],
  selectedId = null,
  onSelect,
  className = '',
  containerClassName = 'gap-2 px-4 py-2',
  chipProps = {},
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className={`flex-row items-center ${containerClassName}`}>
        {items.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={item.id === selectedId}
            onPress={() => onSelect?.(item)}
            {...chipProps}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default ChipList;
