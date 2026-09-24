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
  Image,
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
import { useAuth } from '../../../shared/auth/AuthContext';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import type { FormImage } from '../../../shared/api/types';
import { imageUrl } from '../../../shared/api/imageUrl';
import { ChevronDown, ArrowLeft, ImagePlus, X } from 'lucide-react-native';
import UserAvatar from '../../../shared/components/UserAvatar';

type Option = { value: string; label: string };
type DropdownKey = 'category' | 'city' | 'country' | 'currencytype';

function optionLabel(item: any): string {
  return String(item?.c_name ?? item?.co_city ?? item?.name ?? item?.country_name ?? item?.label ?? '');
}
function optionValue(item: any): string {
  return String(item?.c_id ?? item?.id ?? item?.value ?? item?.co_city ?? item?.name ?? '');
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toFormImage(asset: Asset): FormImage {
  return {
    uri: asset.uri ?? '',
    name: asset.fileName ?? `photo_${Date.now()}.jpg`,
    type: asset.type ?? 'image/jpeg',
  };
}

function str(v: unknown): string {
  if (v == null || v === '0') return '';
  return String(v);
}

const field =
  'bg-white rounded-2xl px-4 py-3.5 text-neutral-900 font-lato text-base border border-neutral-200';
const label = 'text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1';

const CURRENCY_OPTIONS: Option[] = [
  { value: 'PKR', label: 'PKR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'AED', label: 'AED' },
];

const SECTION_TITLE = 'text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase mt-2 mb-3';

export function BrandCompanyFormScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<BrandFranchisesStackParamList>>();
  const route = useRoute<RouteProp<BrandFranchisesStackParamList, 'BrandCompanyForm'>>();
  const id = route.params?.id;
  const { user } = useAuth();

  const isEdit = Boolean(id);
  const { data: companyData, isLoading: loadingCompany } = useBrandCompany(id);
  const { data: createData } = useCompanyCreateData(true);
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [countryId, setCountryId] = useState('');
  const [province, setProvince] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [currencytype, setCurrencytype] = useState('');
  const [cash, setCash] = useState('');
  const [fee, setFee] = useState('');
  const [franchiseFee, setFranchiseFee] = useState('');
  const [totalInvestment, setTotalInvestment] = useState('');
  const [royaltyFee, setRoyaltyFee] = useState('');
  const [brandSlogan, setBrandSlogan] = useState('');
  const [companyYear, setCompanyYear] = useState('');
  const [franchiseYears, setFranchiseYears] = useState('');
  const [franchiseTurnover, setFranchiseTurnover] = useState('');
  const [averageTurnover, setAverageTurnover] = useState('');
  const [commisionType, setCommisionType] = useState('');
  const [typeOfCompany, setTypeOfCompany] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [logo, setLogo] = useState<FormImage | null>(null);
  const [gallery, setGallery] = useState<FormImage[]>([]);
  const [existingLogoUri, setExistingLogoUri] = useState('');
  const [existingGalleryUris, setExistingGalleryUris] = useState<string[]>([]);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [dropdown, setDropdown] = useState<DropdownKey | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!companyData?.company) return;
    const c = companyData.company as any;
    const contact = Array.isArray(c.company_contacts) ? c.company_contacts[0] : undefined;

    setName(str(c.co_name));
    setNumber(str(c.co_office_number));
    setUrl(str(c.co_website_url));
    setCategoryId(str(c.co_category_id));
    setCityId(str(c.co_city));
    setCountryId(str(c.co_country_id));
    setProvince(str(c.co_province));
    setPostalAddress(str(c.co_postal_address));
    setDescription(str(c.co_description ?? c.co_descp ?? c.co_overview));
    setSlug(str(c.co_slug));
    setCurrencytype(str(c.type_currency));
    setCash(str(c.co_cash_required));
    setFee(str(c.co_security_fee));
    setFranchiseFee(str(c.co_franchise_fee));
    setTotalInvestment(str(c.co_total_investment));
    setRoyaltyFee(str(c.co_royalty_fee));
    setBrandSlogan(str(c.brand_slogan));
    setCompanyYear(str(c.company_year));
    setFranchiseYears(str(c.franchise_years));
    setFranchiseTurnover(str(c.franchise_turnover));
    setAverageTurnover(str(c.average_turnover));
    setCommisionType(str(c.commision_type));
    setTypeOfCompany(str(c.type_of_company));
    setVideoLink(str(c.video_link ?? c.co_video_url));

    setContactPerson(
      str(
        c.contact_person ??
          contact?.contact_person ??
          contact?.con_p_name ??
          c.con_p_name,
      ),
    );
    setDesignation(
      str(c.designation ?? contact?.designation ?? contact?.con_desgnation ?? c.con_desgnation),
    );
    setEmailAddress(str(c.email_address ?? contact?.email_address ?? contact?.con_email ?? c.con_email));
    setMobileNumber(
      str(c.mobile_number ?? contact?.mobile_number ?? contact?.con_mobilenumber ?? c.con_mobilenumber),
    );

    const images = Array.isArray(c.company_images) ? c.company_images : [];
    const logoImg = images.find((img: any) => String(img?.img_type) === '1');
    const posterRaw = str(c.company_poster);
    const logoUri =
      imageUrl(logoImg?.img_name && logoImg.img_name !== '0' ? logoImg.img_name : undefined) ??
      (posterRaw && posterRaw !== '0' ? imageUrl(posterRaw) : undefined) ??
      '';
    setExistingLogoUri(logoUri);
    setLogo(null);
    setLogoRemoved(false);

    const galleryUris: string[] = images
      .filter((img: any) => String(img?.img_type) !== '1')
      .map((img: any) => imageUrl(img?.img_name && img.img_name !== '0' ? img.img_name : undefined))
      .filter((u: string | undefined): u is string => Boolean(u));
    setExistingGalleryUris(galleryUris);
    setGallery([]);
  }, [companyData]);

  const categories: Option[] = (
    (companyData as any)?.categories ??
    createData?.categories ??
    []
  ).map((c: any) => ({
    value: optionValue(c),
    label: optionLabel(c),
  }));
  const cities: Option[] = (
    (companyData as any)?.cities ??
    createData?.cities ??
    []
  ).map((c: any) => ({
    value: optionValue(c),
    label: optionLabel(c),
  }));
  const countries: Option[] = (
    (companyData as any)?.countries ??
    createData?.countries ??
    []
  ).map((c: any) => ({
    value: optionValue(c),
    label: optionLabel(c),
  }));

  const optionsFor = (key: DropdownKey): Option[] => {
    if (key === 'category') return categories;
    if (key === 'city') return cities;
    if (key === 'country') return countries;
    return CURRENCY_OPTIONS;
  };

  const selectedLabel = (key: DropdownKey) => {
    const current =
      key === 'category'
        ? categoryId
        : key === 'city'
          ? cityId
          : key === 'country'
            ? countryId
            : currencytype;
    return optionsFor(key).find((o) => o.value === current)?.label ?? '';
  };

  const setDropdownValue = (key: DropdownKey, value: string) => {
    if (key === 'category') setCategoryId(value);
    else if (key === 'city') setCityId(value);
    else if (key === 'country') setCountryId(value);
    else setCurrencytype(value);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEdit && (!slug || slug === slugify(name))) {
      setSlug(slugify(value));
    }
  };

  const pickLogo = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setLogo(toFormImage(asset));
        setLogoRemoved(false);
      }
    });
  };

  const pickGallery = () => {
    const existingCount = existingGalleryUris.length;
    const remaining = 4 - existingCount - gallery.length;
    if (remaining <= 0) return;
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: remaining },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const picked = (response.assets ?? [])
          .filter((a) => a.uri)
          .map(toFormImage)
          .slice(0, remaining);
        setGallery((prev) => [...prev, ...picked]);
      },
    );
  };

  const logoDisplayUri = logo?.uri || (logoRemoved ? '' : existingLogoUri);
  const hasLogo = Boolean(logoDisplayUri);

  const submitting = createMutation.isPending || updateMutation.isPending;

  const effectiveSlug = (slug || slugify(name)).trim();
  const isFormComplete =
    Boolean(
      name.trim() &&
        number.trim() &&
        url.trim() &&
        categoryId &&
        effectiveSlug &&
        description.trim() &&
        cityId &&
        countryId &&
        province.trim() &&
        postalAddress.trim() &&
        currencytype &&
        cash.trim() &&
        fee.trim() &&
        franchiseFee.trim() &&
        totalInvestment.trim() &&
        royaltyFee.trim() &&
        contactPerson.trim() &&
        designation.trim() &&
        emailAddress.trim() &&
        mobileNumber.trim() &&
        hasLogo,
    );

  const canSubmit = isFormComplete && !submitting;

  const handleSubmit = async () => {
    setError('');
    if (!isFormComplete) {
      setError('Please fill in all required fields.');
      return;
    }

    const finalSlug = effectiveSlug;
    const newImages: FormImage[] = logo ? [logo, ...gallery] : gallery;

    const payload = {
      huid: user?.id != null ? String(user.id) : undefined,
      name: name.trim(),
      number: number.trim(),
      url: url.trim(),
      cash: cash.trim(),
      fee: fee.trim(),
      franchise_fee: franchiseFee.trim(),
      total_investment: totalInvestment.trim(),
      royality_fee: royaltyFee.trim(),
      postal_address: postalAddress.trim(),
      description: description.trim(),
      category: categoryId,
      city: cityId,
      country: countryId,
      province: province.trim(),
      slug: finalSlug,
      currencytype,
      brand_slogan: brandSlogan.trim(),
      company_year: companyYear.trim(),
      franchise_years: franchiseYears.trim(),
      franchise_turnover: franchiseTurnover.trim(),
      average_turnover: averageTurnover.trim(),
      commision_type: commisionType.trim(),
      type_of_company: typeOfCompany.trim(),
      video_link: videoLink.trim(),
      contact_person: contactPerson.trim(),
      designation: designation.trim(),
      email_address: emailAddress.trim(),
      mobile_number: mobileNumber.trim(),
      images: newImages,
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

  const renderField = (key: DropdownKey, placeholder: string) => (
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

  const textInput = (
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    extra?: {
      multiline?: boolean;
      keyboardType?: 'url' | 'phone-pad' | 'default' | 'numeric';
    },
  ) => (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#A3ABC4"
      className={`${field} ${extra?.multiline ? 'min-h-[88px]' : ''} mb-4`}
      style={extra?.multiline ? { textAlignVertical: 'top' } : undefined}
      keyboardType={extra?.keyboardType ?? 'default'}
      multiline={extra?.multiline}
      value={value}
      onChangeText={onChange}
    />
  );

  return (
    <MainLayout
      showHeader={true}
      headerRight={
        <UserAvatar />
      }
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
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
              <Text className={SECTION_TITLE}>Brand info</Text>

              <Text className={label}>Brand name *</Text>
              {textInput(name, handleNameChange, 'e.g. Acme Franchise')}

              <Text className={label}>Brand slogan</Text>
              {textInput(brandSlogan, setBrandSlogan, 'Short tagline for the brand')}

              <Text className={label}>Office number *</Text>
              {textInput(number, setNumber, '+92 300 0000000', { keyboardType: 'phone-pad' })}

              <Text className={label}>Website *</Text>
              {textInput(url, setUrl, 'https://example.com', { keyboardType: 'url' })}

              <Text className={label}>Category *</Text>
              {renderField('category', 'Select category')}

              <Text className={label}>Company type</Text>
              {textInput(typeOfCompany, setTypeOfCompany, 'e.g. Franchise / Chain')}

              <Text className={label}>Slug *</Text>
              {textInput(slug, setSlug, 'auto-from-name')}

              <Text className={label}>Description *</Text>
              {textInput(description, setDescription, 'Tell investors what makes this franchise special…', {
                multiline: true,
              })}

              <Text className={label}>Video link (YouTube)</Text>
              {textInput(videoLink, setVideoLink, 'YouTube video ID or URL')}

              <Text className={SECTION_TITLE}>About & performance</Text>

              <Text className={label}>Established year</Text>
              {textInput(companyYear, setCompanyYear, 'e.g. 2015', { keyboardType: 'numeric' })}

              <Text className={label}>Franchising since</Text>
              {textInput(franchiseYears, setFranchiseYears, 'e.g. 2018', { keyboardType: 'numeric' })}

              <Text className={label}>Franchise turnover</Text>
              {textInput(franchiseTurnover, setFranchiseTurnover, 'e.g. 12000000')}

              <Text className={label}>Average turnover</Text>
              {textInput(averageTurnover, setAverageTurnover, 'e.g. 5000000')}

              <Text className={label}>Commission type</Text>
              {textInput(commisionType, setCommisionType, 'e.g. 5% or fixed fee')}

              <Text className={SECTION_TITLE}>Location</Text>

              <Text className={label}>City *</Text>
              {renderField('city', 'Select city')}

              <Text className={label}>Country *</Text>
              {renderField('country', 'Select country')}

              <Text className={label}>Province *</Text>
              {textInput(province, setProvince, 'e.g. Punjab')}

              <Text className={label}>Postal address *</Text>
              {textInput(postalAddress, setPostalAddress, 'Street, area, city', { multiline: true })}

              <Text className={SECTION_TITLE}>Investment</Text>

              <Text className={label}>Currency *</Text>
              {renderField('currencytype', 'Select currency')}

              <Text className={label}>Cash required *</Text>
              {textInput(cash, setCash, 'e.g. 500000')}

              <Text className={label}>Security fee *</Text>
              {textInput(fee, setFee, 'e.g. 100000')}

              <Text className={label}>Franchise fee *</Text>
              {textInput(franchiseFee, setFranchiseFee, 'e.g. 250000')}

              <Text className={label}>Total investment *</Text>
              {textInput(totalInvestment, setTotalInvestment, 'e.g. 1500000')}

              <Text className={label}>Royalty fee *</Text>
              {textInput(royaltyFee, setRoyaltyFee, 'e.g. 5% or 50000')}

              <Text className={SECTION_TITLE}>Contact person</Text>

              <Text className={label}>Name *</Text>
              {textInput(contactPerson, setContactPerson, 'Contact person name')}

              <Text className={label}>Designation *</Text>
              {textInput(designation, setDesignation, 'e.g. Franchise Manager')}

              <Text className={label}>Email *</Text>
              {textInput(emailAddress, setEmailAddress, 'name@example.com')}

              <Text className={label}>Mobile number *</Text>
              {textInput(mobileNumber, setMobileNumber, '+92 300 0000000', {
                keyboardType: 'phone-pad',
              })}

              <Text className={SECTION_TITLE}>Images</Text>

              <Text className={label}>Logo *</Text>
              <TouchableOpacity
                className={`${field} flex-row items-center gap-3 mb-4`}
                activeOpacity={0.7}
                onPress={pickLogo}
              >
                {logoDisplayUri ? (
                  <Image
                    source={{ uri: logoDisplayUri }}
                    className="w-12 h-12 rounded-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-lg bg-primary-200 items-center justify-center">
                    <ImagePlus size={20} color="#5279AC" />
                  </View>
                )}
                <Text className="text-neutral-700 flex-1">
                  {logoDisplayUri ? 'Change logo' : 'Upload logo (image_1)'}
                </Text>
                {logoDisplayUri || logo ? (
                  <TouchableOpacity
                    onPress={() => {
                      setLogo(null);
                      setLogoRemoved(true);
                      setExistingLogoUri('');
                    }}
                    hitSlop={8}
                  >
                    <X size={18} color="#8990A8" />
                  </TouchableOpacity>
                ) : null}
              </TouchableOpacity>

              <Text className={label}>Gallery (up to 4)</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {existingGalleryUris.map((uri) => (
                  <View key={`existing-${uri}`} className="relative">
                    <Image source={{ uri }} className="w-20 h-20 rounded-xl" resizeMode="cover" />
                  </View>
                ))}
                {gallery.map((img, index) => (
                  <View key={`${img.uri}-${index}`} className="relative">
                    <Image source={{ uri: img.uri }} className="w-20 h-20 rounded-xl" resizeMode="cover" />
                    <TouchableOpacity
                      className="absolute -top-1.5 -right-1.5 bg-white rounded-full border border-neutral-200 w-6 h-6 items-center justify-center"
                      onPress={() => setGallery((prev) => prev.filter((_, i) => i !== index))}
                      hitSlop={6}
                    >
                      <X size={12} color="#3F465C" />
                    </TouchableOpacity>
                  </View>
                ))}
                {existingGalleryUris.length + gallery.length < 4 ? (
                  <TouchableOpacity
                    className="w-20 h-20 rounded-xl bg-gray-50 border border-dashed border-neutral-300 items-center justify-center"
                    onPress={pickGallery}
                    activeOpacity={0.7}
                  >
                    <ImagePlus size={20} color="#8990A8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {error ? (
                <Text className="text-red-500 text-sm font-lato mb-3 text-center">{error}</Text>
              ) : null}

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!canSubmit}
                className={`rounded-2xl py-4 items-center justify-center ${
                  canSubmit ? 'bg-primary-700' : 'bg-neutral-300'
                }`}
                activeOpacity={0.85}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text
                    className={`font-lato-bold text-base ${
                      canSubmit ? 'text-white' : 'text-neutral-500'
                    }`}
                  >
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
              {dropdown === 'category'
                ? 'Select category'
                : dropdown === 'city'
                  ? 'Select city'
                  : dropdown === 'country'
                    ? 'Select country'
                    : 'Select currency'}
            </Text>
            <FlatList
              data={dropdown ? optionsFor(dropdown) : []}
              keyExtractor={(item, i) => `${item.value}-${i}`}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 border-b border-neutral-200"
                  onPress={() => {
                    if (dropdown) setDropdownValue(dropdown, item.value);
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
