import React from 'react';
import { ScrollView, View } from 'react-native';
import Chip from './Chip';

export interface ChipItem {
  c_id: string;
  c_name: string;
  c_slug: string;
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
            key={item.c_id}
            label={item.c_name}
            selected={item.c_slug === selectedId}
            onPress={() => onSelect?.(item)}
            {...chipProps}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default ChipList;
