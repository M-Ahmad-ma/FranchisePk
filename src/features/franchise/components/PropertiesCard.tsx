import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ArrowRight, MapPin, Layers } from 'lucide-react-native';
import { PropertyCardProps } from '../../../shared/types';
import Button from '../../../shared/components/Button';

interface Props extends PropertyCardProps {
  onPress?: () => void;
  containerClassName?: string;
}

const PropertyCard: React.FC<Props> = ({
  title,
  description,
  marketValue,
  details,
  imageUrl,
  status,
  city,
  address,
  floors,
  onPress,
  containerClassName = '',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`bg-white rounded-2xl overflow-hidden mx-4 mb-4 ${containerClassName}`}
      style={{ elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}
    >
      {imageUrl && (
        <View>
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-48"
            resizeMode="cover"
          />
          {status && (
            <View className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1">
              <View className="flex-row items-center gap-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-[#00A572]" />
                <Text className="text-neutral-900 text-[11px] font-lato-bold tracking-wide">
                  {status.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      <View className="px-4 py-4">
        <Text className="text-[10px] font-lato-bold tracking-[0.18em] text-primary-700 uppercase mb-1">
          {details.type}
        </Text>
        <Text className="text-xl font-lato-black text-neutral-dark2">
          {title}
        </Text>

        <View className="flex-row items-center gap-1.5 mt-1.5">
          {address ? (
            <>
              <MapPin size={14} color="#8990A8" />
              <Text className="text-neutral-600 text-sm font-lato flex-1">
                {address}
              </Text>
            </>
          ) : city ? (
            <Text className="text-neutral-600 text-sm font-lato">{city}</Text>
          ) : null}
        </View>

        {floors && floors.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5 mt-3">
            {floors.map((floor, i) => (
              <View key={i} className="flex-row items-center gap-1 rounded-lg bg-primary-200 px-2 py-1">
                <Layers size={11} color="#436CF5" />
                <Text className="text-primary-800 text-[11px] font-lato-bold">
                  {floor}
                </Text>
              </View>
            ))}
          </View>
        )}

      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
