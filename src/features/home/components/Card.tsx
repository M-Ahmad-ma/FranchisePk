import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FeaturedCardProps } from '../../../shared/types';

const Card: React.FC<FeaturedCardProps> = ({
  title,
  description,
  investmentRange,
  tag, // ignored (no tag in this design)
  imageSource,
  onPress,
  buttonText, // ignored
  onPressDetails, // ignored
  containerClassName = '',
  imageClassName = '',
  tagContainerClassName = '', // unused
  tagTextClassName = '',      // unused
  titleClassName = '',
  descriptionClassName = '',
  investmentClassName = '',
  detailsButtonClassName = '', // unused
  detailsTextClassName = '',   // unused
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`bg-white z-50 rounded-xl mx-2 my-2 overflow-hidden shadow-md shadow-black/10 ${containerClassName}`}
    >
      {/* Image - NOT full width. Has margins on sides and top */}
      {imageSource && (
        <Image
          source={imageSource}
          className={`rounded-xl h-44 ${imageClassName}`}
          resizeMode="cover"
          resizeMethod="resize"
          onError={(e) => {
            console.log('[Card] ImageError:', JSON.stringify(imageSource).slice(0, 120), e.nativeEvent?.error);
          }}
        />
      )}

      <View className="px-4 pb-4 pt-2">
        {tag && (
          <Text className="text-neutral-500 text-xs font-lato-bold uppercase mb-0.5">
            {tag}
          </Text>
        )}


        <Text
          numberOfLines={1}
          className={`text-2xl font-lato-bold text-neutral-800 mt-0.5 ${titleClassName}`}
        >
          {title}
        </Text>

        {investmentRange && (
          <Text
            className={`text-xl font-lato-light text-neutral-900 ${investmentClassName}`}
          >
            {investmentRange}
          </Text>
        )}

        {description && (
          <Text
            numberOfLines={2}
            className={`text-[12px] font-normal text-neutral-600 mt-0.5 ${descriptionClassName}`}
          >
            {description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Card;
