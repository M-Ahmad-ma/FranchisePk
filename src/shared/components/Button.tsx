import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined' | 'link';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode; // ← icon element
  iconPosition?: 'left' | 'right'; // optional, default 'left'
  className?: string;
  textClassName?: string;
  loadingColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  textClassName = '',
  loadingColor = '#FFFFFF',
}) => {
  // Define styles for each variant
  const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
    primary: {
      container: 'bg-primary-700',
      text: 'text-white',
    },
    secondary: {
      container: 'bg-secondary-700',
      text: 'text-white',
    },
    inverted: {
      container: 'bg-primary-dark',
      text: 'text-white',
    },
    outlined: {
      container: 'bg-transparent',
      text: 'text-primary-700',
    },
    link: {
      container: 'bg-transparent border-none',
      text: 'text-primary-700', // underline added
    },
  };

  const { container, text } = variantStyles[variant];
  const disabledClasses = disabled ? 'opacity-50' : '';

  // Build content: loading spinner or icon + title
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={loadingColor} />;
    }

    const titleElement = (
      <Text className={`text-base font-lato-bold ${text} ${textClassName}`}>
        {title}
      </Text>
    );

    // If no icon, just return title
    if (!icon) return titleElement;

    // If icon exists, wrap both in a row with spacing
    return (
      <View className="flex-row items-center gap-2">
        {iconPosition === 'left' && icon}
        {titleElement}
        {iconPosition === 'right' && icon}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={`px-5 py-2 rounded-xl items-center justify-center flex-row ${container} ${disabledClasses} ${className}`}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
