import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BrandFranchisesStackParamList } from '../../../shared/types/navigation';
import {
  useBrandCompany,
  useCompanyCreateData,
  useCreateCompany,
  useUpdateCompany,
} from '../../../shared/hooks/useBrand';
import { ChevronDown, ArrowLeft } from 'lucide-react-native';

type Option = { value: string; label: string };

function optionLabel(item: any): string {
  return String(item?.c_name ?? item?.co_city ?? item?.name ?? item?.country_name ?? item?.label ?? '');
}
function optionValue(item: any): string {
  return String(item?.c_id ?? item?.id ?? item?.value ?? item?.co_city ?? item?.name ?? '');
}

const field =
  'bg-white rounded-2xl px-4 py-3.5 text-neutral-900 font-lato text-base border border-neutral-200';

export function BrandCompanyFormScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<BrandFranchisesStackParamList>>();
  const route = useRoute<RouteProp<BrandFranchisesStackParamList, 'BrandCompanyForm'>>();
  const id = route.params?.id;

  const isEdit = Boolean(id);
  const { data: companyData, isLoading: loadingCompany } = useBrandCompany(id);
  const { data: createData } = useCompanyCreateData(true);
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [countryId, setCountryId] = useState('');
  const [description, setDescription] = useState('');
  const [dropdown, setDropdown] = useState<'category' | 'city' | 'country' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (companyData?.company) {
      const c = companyData.company as any;
      setName(c.co_name ?? '');
      setCategoryId(String(c.co_category_id ?? ''));
      setDescription(c.co_descp ?? c.co_overview ?? '');
    }
  }, [companyData]);

  const categories: Option[] = (createData?.categories ?? []).map((c: any) => ({
    value: optionValue(c),
    label: optionLabel(c),
  }));
  const cities: Option[] = (createData?.cities ?? []).map((c: any) => ({
    value: optionValue(c),
    label: optionLabel(c),
  }));
  const countries: Option[] = (createData?.countries ?? []).map((c: any) => ({
    value: optionValue(c),
    label: optionLabel(c),
  }));

  const optionsFor = (key: 'category' | 'city' | 'country'): Option[] =>
    key === 'category' ? categories : key === 'city' ? cities : countries;

  const selectedLabel = (key: 'category' | 'city' | 'country') => {
    const current = key === 'category' ? categoryId : key === 'city' ? cityId : countryId;
    const found = optionsFor(key).find((o) => o.value === current);
    return found?.label ?? '';
  };

  const submitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter a brand name.');
      return;
    }
    const payload = {
      name: name.trim(),
      category_id: categoryId || undefined,
      city_id: cityId || undefined,
      country_id: countryId || undefined,
      description: description.trim() || undefined,
    };
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigation.goBack();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Something went wrong. Please try again.');
    }
  };

  const renderField = (key: 'category' | 'city' | 'country', placeholder: string) => (
    <TouchableOpacity
      className={`${field} flex-row items-center justify-between mb-4`}
      onPress={() => setDropdown(key)}
      activeOpacity={0.7}
    >
      <Text className={selectedLabel(key) ? 'text-neutral-900' : 'text-neutral-400'}>
        {selectedLabel(key) || placeholder}
      </Text>
      <ChevronDown size={18} color="#8990A8" />
    </TouchableOpacity>
  );

  return (
    <MainLayout>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View className="px-4 pt-4 flex-row items-center gap-3">
            <TouchableOpacity
              className="w-10 h-10 rounded-full border border-neutral-200 bg-white items-center justify-center"
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#3F465C" />
            </TouchableOpacity>
            <Text className="text-neutral-900 text-2xl font-lato-black">
              {isEdit ? 'Edit Brand' : 'Add Brand'}
            </Text>
          </View>

          {loadingCompany ? (
            <View className="flex-1 items-center justify-center py-24">
              <ActivityIndicator size="large" color="#5279AC" />
            </View>
          ) : (
            <View className="px-4 pt-6">
              <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Brand name</Text>
              <TextInput
                placeholder="e.g. Acme Franchise"
                placeholderTextColor="#A3ABC4"
                className={`${field} mb-4`}
                value={name}
                onChangeText={setName}
              />

              <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Category</Text>
              {renderField('category', 'Select category')}

              <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">City</Text>
              {renderField('city', 'Select city')}

              <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Country</Text>
              {renderField('country', 'Select country')}

              <Text className="text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1">Description</Text>
              <TextInput
                placeholder="Tell investors what makes this franchise special…"
                placeholderTextColor="#A3ABC4"
                multiline
                className={`${field} min-h-[96px] mb-4`}
                style={{ textAlignVertical: 'top' }}
                value={description}
                onChangeText={setDescription}
              />

              {error ? (
                <Text className="text-red-500 text-sm font-lato mb-3 text-center">{error}</Text>
              ) : null}

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                className="bg-primary-700 rounded-2xl py-4 items-center justify-center"
                activeOpacity={0.85}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-lato-bold text-base">
                    {isEdit ? 'Save Changes' : 'Create Brand'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={dropdown !== null} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center px-6"
          activeOpacity={1}
          onPress={() => setDropdown(null)}
        >
          <View className="bg-white rounded-3xl p-4 max-h-[70%]">
            <Text className="text-neutral-900 font-lato-bold text-base px-2 pt-2 pb-1">
              {dropdown === 'category' ? 'Select category' : dropdown === 'city' ? 'Select city' : 'Select country'}
            </Text>
            <FlatList
              data={dropdown ? optionsFor(dropdown) : []}
              keyExtractor={(item, i) => `${item.value}-${i}`}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 border-b border-neutral-200"
                  onPress={() => {
                    if (dropdown === 'category') setCategoryId(item.value);
                    else if (dropdown === 'city') setCityId(item.value);
                    else setCountryId(item.value);
                    setDropdown(null);
                  }}
                >
                  <Text className="text-neutral-900">{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              className="mt-2 py-2 items-center"
              onPress={() => setDropdown(null)}
            >
              <Text className="text-primary-700 font-lato-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </MainLayout>
  );
}
