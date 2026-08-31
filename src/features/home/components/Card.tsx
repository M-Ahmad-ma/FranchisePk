import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FeaturedCardProps } from '../../../shared/types';
import { ArrowUpRight } from 'lucide-react-native';

const Card: React.FC<FeaturedCardProps> = ({
  title,
  description,
  investmentRange,
  tag,
  imageSource,
  onPress,
  containerClassName = '',
  imageClassName = '',
  tagTextClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  investmentClassName = '',
  overlayClassName = 'bg-black/20',    // new prop with default
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`bg-white rounded-2xl mx-2 my-2 overflow-hidden ${containerClassName}`}
      style={{
        shadowColor: '#0A1A3D',
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
      }}
    >
      {imageSource ? (
        <View className="relative w-full h-full">
          <Image
            source={imageSource}
            className={`w-full h-full ${imageClassName}`}
            resizeMode="cover"
            onError={(e) => {
              console.log('[Card] ImageError:', JSON.stringify(imageSource).slice(0, 120), e.nativeEvent?.error);
            }}
          />

          <View className={`absolute w-full h-full ${overlayClassName}`} />

          <TouchableOpacity
            className="absolute  p-4 rounded-xl top-1 right-2"
            activeOpacity={0.8}
            onPress={onPress}
          >
            <ArrowUpRight color="white" />
          </TouchableOpacity>

          {/* Tag chip */}
          {tag && (
            <View className="absolute top-3 left-3">
              <Text
                className={`text-white font-lato-bold text-[10px] tracking-[1.5px] uppercase ${tagTextClassName}`}
              >
                {tag}
              </Text>
            </View>
          )}

          {/* Overlaid content */}
          <View className="absolute left-4 right-4 bottom-3.5">
            {investmentRange && (
              <Text
                className={`text-amber-500 font-lato-bold text-sm mb-1 ${investmentClassName}`}
              >
                {investmentRange}
              </Text>
            )}
            {title && (
              <Text
                numberOfLines={1}
                className={`text-white font-lato-black text-lg leading-6 ${titleClassName}`}
              >
                {title}
              </Text>
            )}
            {description && (
              <Text
                numberOfLines={2}
                className={`text-white/80 text-[11px] font-lato leading-4 mt-1 ${descriptionClassName}`}
              >
                {description}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center bg-neutral-200 px-4">
          <Text numberOfLines={1} className="text-neutral-500 font-lato text-sm">
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Card;
