// components/MultiStepFilter.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';

export interface FilterOption {
  id: string | number;
  label: string;
}

export interface Filters {
  industry: FilterOption | null;
  state: FilterOption | null;
  investment: FilterOption | null;
}

interface MultiStepFilterProps {
  industries: FilterOption[];
  states: FilterOption[];
  investments: FilterOption[];
  onSearch: (filters: Filters) => void;
  selectedIndustry?: FilterOption | null;
  selectedState?: FilterOption | null;
  selectedInvestment?: FilterOption | null;
  onIndustryChange?: (option: FilterOption | null) => void;
  onStateChange?: (option: FilterOption | null) => void;
  onInvestmentChange?: (option: FilterOption | null) => void;
  // Customisation – now accepts responsive overrides
  containerClassName?: string;
  fieldClassName?: string;
  searchButtonClassName?: string;
}

const MultiStepFilter: React.FC<MultiStepFilterProps> = ({
  industries,
  states,
  investments,
  onSearch,
  selectedIndustry: externalIndustry,
  selectedState: externalState,
  selectedInvestment: externalInvestment,
  onIndustryChange,
  onStateChange,
  onInvestmentChange,
  containerClassName = 'flex-wrap mx-3 items-center px-4 py-3 bg-white rounded-xl',
  fieldClassName = 'flex flex-row items-center justify-between px-3 py-2 rounded-lg border border-neutral-300',
  searchButtonClassName = 'px-6 py-2 rounded-lg bg-secondary-500',
}) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 400;   // adjust threshold as needed

  const [internalIndustry, setInternalIndustry] = useState<FilterOption | null>(null);
  const [internalState, setInternalState] = useState<FilterOption | null>(null);
  const [internalInvestment, setInternalInvestment] = useState<FilterOption | null>(null);

  const industry = externalIndustry !== undefined ? externalIndustry : internalIndustry;
  const state = externalState !== undefined ? externalState : internalState;
  const investment = externalInvestment !== undefined ? externalInvestment : internalInvestment;

  const setIndustry = (val: FilterOption | null) => {
    if (onIndustryChange) onIndustryChange(val);
    else setInternalIndustry(val);
  };
  const setState = (val: FilterOption | null) => {
    if (onStateChange) onStateChange(val);
    else setInternalState(val);
  };
  const setInvestment = (val: FilterOption | null) => {
    if (onInvestmentChange) onInvestmentChange(val);
    else setInternalInvestment(val);
  };

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<'industry' | 'state' | 'investment' | null>(null);

  const openModal = (field: 'industry' | 'state' | 'investment') => {
    setActiveField(field);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActiveField(null);
  };

  const handleSelect = (option: FilterOption) => {
    if (activeField === 'industry') setIndustry(option);
    else if (activeField === 'state') setState(option);
    else if (activeField === 'investment') setInvestment(option);
    closeModal();
  };

  const clearSelection = () => {
    if (activeField === 'industry') setIndustry(null);
    else if (activeField === 'state') setState(null);
    else if (activeField === 'investment') setInvestment(null);
    closeModal();
  };

  const getActiveOptions = (): FilterOption[] => {
    if (activeField === 'industry') return industries;
    if (activeField === 'state') return states;
    if (activeField === 'investment') return investments;
    return [];
  };

  const getSelectedLabel = (field: 'industry' | 'state' | 'investment') => {
    const val = field === 'industry' ? industry : field === 'state' ? state : investment;
    return val ? val.label : `Select ${field.charAt(0).toUpperCase() + field.slice(1)}`;
  };

  const renderField = (field: 'industry' | 'state' | 'investment') => (
    <TouchableOpacity
      key={field}
      className={`
        ${fieldClassName} 
        ${isSmall ? 'w-full mb-2' : 'flex-1 mx-1'}   // full width on small, flex on larger
      `}
      onPress={() => openModal(field)}
      activeOpacity={0.7}
    >
      <Text
        className={`font-lato text-sm ${(field === 'industry' ? industry : field === 'state' ? state : investment)
          ? 'text-primary-dark'
          : 'text-neutral-600'
          }`}
        numberOfLines={1}
      >
        {getSelectedLabel(field)}
      </Text>
      <ChevronDown size={16} color="#6F778E" />
    </TouchableOpacity>
  );

  return (
    <View className={containerClassName}>
      <View className="flex-row flex-wrap items-center w-full">
        {renderField('industry')}
        {renderField('state')}
        {renderField('investment')}
      </View>

      <TouchableOpacity
        className={`
          ${searchButtonClassName} 
          ${isSmall ? 'w-1/2 mt-2' : 'ml-2'}
        `}
        onPress={() => onSearch({ industry, state, investment })}
        activeOpacity={0.8}
      >
        <Text className="font-lato-bold text-white text-sm text-center">SEARCH</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View className="flex-1 bg-black/40 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl max-h-[60%] p-4">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="font-lato-bold text-lg text-primary-dark">
                    Select {activeField ? activeField.charAt(0).toUpperCase() + activeField.slice(1) : ''}
                  </Text>
                  <TouchableOpacity onPress={clearSelection}>
                    <Text className="font-lato text-secondary-500">Clear</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={getActiveOptions()}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => {
                    const isSelected =
                      (activeField === 'industry' && industry?.id === item.id) ||
                      (activeField === 'state' && state?.id === item.id) ||
                      (activeField === 'investment' && investment?.id === item.id);
                    return (
                      <TouchableOpacity
                        className={`py-3 px-4 border-b border-neutral-200 ${isSelected ? 'bg-primary-200' : ''
                          }`}
                        onPress={() => handleSelect(item)}
                      >
                        <Text
                          className={`font-lato ${isSelected ? 'text-primary-dark font-lato-bold' : 'text-neutral-800'
                            }`}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />

                <TouchableOpacity
                  className="mt-4 py-3 bg-neutral-200 rounded-lg"
                  onPress={closeModal}
                >
                  <Text className="text-center font-lato text-neutral-700">Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MultiStepFilter;
