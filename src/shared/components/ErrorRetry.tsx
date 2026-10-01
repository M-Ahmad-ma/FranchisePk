import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

type ErrorRetryProps = {
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorRetry({
  message = 'Unable to load data.',
  onRetry,
  className = '',
}: ErrorRetryProps) {
  return (
    <View className={`items-center justify-center px-6 py-10 ${className}`}>
      <Text className="font-lato-bold text-base text-neutral-700 text-center">
        {message}
      </Text>
      <Text className="font-lato text-sm text-neutral-500 text-center mt-1">
        Check your internet connection and try again.
      </Text>
      {onRetry ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRetry}
          className="flex-row items-center gap-2 bg-primary-700 rounded-2xl px-6 py-3 mt-4"
        >
          <RefreshCw size={16} color="#FFFFFF" />
          <Text className="font-lato-bold text-base text-white">Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
