// src/components/Search.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Search as SearchIcon, X } from 'lucide-react-native';

interface SearchProps extends Omit<TextInputProps, 'className' | 'onChangeText'> {
  /** Placeholder text (default: "Search...") */
  placeholder?: string;
  /** Current value (controlled) */
  value?: string;
  /** Callback when text changes */
  onChangeText?: (text: string) => void;
  /** Callback when search is submitted (Enter key) or button pressed */
  onSearch?: (text: string) => void;
  /** Callback when clear button is pressed */
  onClear?: () => void;
  /** Additional Tailwind classes for the outer container */
  className?: string;
  /** Additional Tailwind classes for the input */
  inputClassName?: string;
  /** Additional Tailwind classes for the search icon */
  iconClassName?: string;
  /** Additional Tailwind classes for the clear icon */
  clearIconClassName?: string;
  /** Whether to show the clear button when text is not empty (default: true) */
  showClearButton?: boolean;
  /** Render a search button instead of using return key (default: false) */
  showSearchButton?: boolean;
}

const Search: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  value: externalValue,
  onChangeText,
  onSearch,
  onClear,
  className = '',
  inputClassName = '',
  iconClassName = '',
  clearIconClassName = '',
  showClearButton = true,
  showSearchButton = false,
  ...textInputProps
}) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = externalValue !== undefined;
  const currentValue = isControlled ? externalValue : internalValue;

  const handleChangeText = (text: string) => {
    if (!isControlled) setInternalValue(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    onChangeText?.('');
    onClear?.();
  };

  const handleSubmit = () => {
    onSearch?.(currentValue);
  };

  // Decide which icon color to use based on current theme (we'll use neutral-500 for default)
  const iconColor = '#8990A8'; // neutral-600 from your config (grayish)

  return (
    <View
      className={`flex-row items-center rounded-xl bg-secondary-200 px-4 py-2  border border-neutral-300 focus:border-primary-500 ${className}`}
      style={{
        shadowColor: "#000",
        elevation: 5
      }}
    >
      <SearchIcon size={20} color={iconColor} className={iconClassName} />

      <TextInput
        className={`flex-1 ml-2 text-neutral-800 py-2 text-base font-lato placeholder:text-neutral-400 ${inputClassName}`}
        placeholder={placeholder}
        placeholderTextColor="#A3ABC4" // neutral-500
        value={currentValue}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        returnKeyType={showSearchButton ? 'done' : 'search'}
        {...textInputProps}
      />

      {showClearButton && currentValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          className="ml-2 p-1 rounded-full bg-neutral-200 active:bg-neutral-300"
        >
          <X size={16} color="#6F778E" className={clearIconClassName} />
        </TouchableOpacity>
      )}

      {showSearchButton && (
        <TouchableOpacity
          onPress={handleSubmit}
          className="ml-2 px-4 py-1.5 rounded-full bg-primary-700 active:bg-primary-800"
        >
          <SearchIcon size={18} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Search;
