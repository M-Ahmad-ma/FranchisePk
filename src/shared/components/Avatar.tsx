// src/components/Avatar.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';

interface AvatarProps {
  /** Image source (uri or local require) */
  source?: ImageSourcePropType;
  /** Size of the avatar (width & height) – default 48 */
  size?: number;
  /** Fallback initials (e.g., "JD") – shown if no image or on error */
  initials?: string;
  /** Callback when avatar is pressed */
  onPress?: () => void;
  /** Border radius – defaults to size/2 (circle) */
  borderRadius?: number;
  /** Additional Tailwind classes for the outer container */
  className?: string;
  /** Additional Tailwind classes for the initials text */
  textClassName?: string;
  /** Additional Tailwind classes for the image (overrides default) */
  imageClassName?: string;

}

const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 48,
  initials,
  onPress,
  borderRadius,
  className = '',
  textClassName = '',
  imageClassName = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Determine if we should show the image
  const showImage = !!source && !imageError;

  // Compute border radius
  const finalBorderRadius = borderRadius !== undefined ? borderRadius : size / 2;

  // Container style with dynamic sizing
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: finalBorderRadius,
  };

  // Image style
  const imageStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: finalBorderRadius,
  };

  // Base Tailwind classes for container
  // Default background is primary-700, text is white, centered content
  const containerClasses = `bg-primary-700 items-center justify-center overflow-hidden ${className}`;

  // Text classes: default white, font-lato-bold, adjust size based on size prop
  // We'll set text size dynamically via style because Tailwind classes are fixed
  const textSize = size * 0.4;
  const textClasses = `text-neutral-100 font-lato-bold ${textClassName}`;

  // Image classes – we use object-cover to fill the container
  const imageClasses = `object-cover ${imageClassName}`;

  const content = showImage ? (
    <Image
      source={source}
      style={imageStyle}
      className={imageClasses}
      onError={() => setImageError(true)}
    />
  ) : (
    <Text
      style={{ fontSize: textSize }}
      className={textClasses}
    >
      {initials || '?'}
    </Text>
  );

  // Combine dynamic style with className
  const combinedContainerStyle = [containerStyle];

  if (onPress) {
    return (
      <TouchableOpacity
        style={combinedContainerStyle}
        className={containerClasses}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={combinedContainerStyle} className={containerClasses}>
      {content}
    </View>
  );
};

export default Avatar;