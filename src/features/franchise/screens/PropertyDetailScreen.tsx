import { useEffect, useRef } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Animated, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { PropertiesStackParamList } from '../../../shared/types/navigation';
import { ArrowLeft, MapPin, CalendarDays, Layers, CheckCircle2, Users, ChevronRight } from 'lucide-react-native';
import Button from '../../../shared/components/Button';
import BottomSheet from '../../../shared/components/BottomSheet';
import { useState } from 'react';
import { useProperty } from '../../../shared/hooks/useProperties';
import { imageUrl } from '../../../shared/api/imageUrl';
import { Skeleton } from '../../../shared/components/Skeleton';

function useStagger(count: number) {
  const values = useRef([...Array(count)].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      90,
      values.map((v) =>
        Animated.timing(v, { toValue: 1, duration: 520, useNativeDriver: true }),
      ),
    ).start();
  }, [values]);
  return values;
}

function SlideIn({ value, children }: { value: Animated.Value; children: React.ReactNode }) {
  const opacity = value;
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

export function PropertyDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PropertiesStackParamList>>();
  const route =
    useRoute<RouteProp<PropertiesStackParamList, 'PropertyDetail'>>();
  const { id } = route.params;

  const { data, isLoading, isError } = useProperty(id);
  const property = data?.property;

  const [sheetVisible, setSheetVisible] = useState(false);
  const stagger = useStagger(6);

  if (isLoading) {
    return (
      <View className="flex-1 bg-light">
        <Skeleton className="w-full h-[420px] rounded-none" />
        <View className="-mt-9 rounded-t-[2.5rem] bg-white px-5 pt-8 pb-10 flex-1">
          <Skeleton className="w-24 h-3 mb-3" />
          <Skeleton className="w-3/4 h-8 mb-3" />
          <Skeleton className="w-1/2 h-4 mb-8" />
          <Skeleton className="w-full h-32 rounded-2xl mb-7" />
          <Skeleton className="w-2/3 h-4 mb-3" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-5/6 h-4" />
        </View>
      </View>
    );
  }

  if (isError || !property) {
    return (
      <View className="flex-1 items-center justify-center bg-light px-6">
        <Text className="text-neutral-500 text-center">Unable to load property details.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} variant="outlined" className="mt-4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">
      <StatusBar barStyle="light-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="h-[420px] relative">
          <Image
            source={{ uri: imageUrl(property.pimage) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop' }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          {/* <View className="absolute inset-0 bg-[#001551]" style={{ opacity: 0.38 }} /> */}
          {/* <View className="absolute bottom-0 left-0 right-0 h-40 bg-[#001551]/40" /> */}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-4 top-4 z-50"
          >
            <View className="w-11 h-11 rounded-full bg-white/15 border border-white/25 items-center justify-center">
              <ArrowLeft size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {property.pstatus && (
            <View className="absolute right-4 top-4 z-50">
              <View className="flex-row items-center gap-1.5 rounded-full bg-[#00A572] px-3.5 py-1.5 shadow-lg">
                <View className="w-1.5 h-1.5 rounded-full bg-white" />
                <Text className="text-white text-xs font-lato-bold tracking-wide">
                  {property.pstatus === '1' ? 'AVAILABLE' : property.pstatus.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="-mt-9 rounded-t-[2.5rem] bg-white px-5 pt-8 pb-10">
          <SlideIn value={stagger[0]}>
            <Text className="text-[11px] font-lato-bold tracking-[0.22em] text-primary-700 uppercase">
              Premium Commercial · Property
            </Text>
            <Text className="text-[30px] leading-[44px] font-lato-black text-neutral-dark2 mt-2">
              {property.pName}
            </Text>
            {property.sAddress && (
              <View className="flex-row items-center gap-2 mt-3">
                <MapPin size={16} color="#6F778E" />
                <Text className="text-neutral-600 text-base font-lato">{property.sAddress}</Text>
              </View>
            )}
          </SlideIn>

          <SlideIn value={stagger[1]}>
            <View className="mt-7 border border-neutral-200 rounded-2xl overflow-hidden">
              <View className="flex-row border-b border-neutral-200">
                <View className="flex-1 p-4 border-r border-neutral-200">
                  <Text className="text-[10px] font-lato-bold tracking-[0.18em] text-neutral-500 uppercase">City</Text>
                  <Text className="text-neutral-900 font-lato-bold mt-1">{property.Pcity || '—'}</Text>
                </View>
                <View className="flex-1 p-4">
                  <Text className="text-[10px] font-lato-bold tracking-[0.18em] text-neutral-500 uppercase">Status</Text>
                  <View className="flex-row items-center gap-1.5 mt-1">
                    <View className="w-2 h-2 rounded-full bg-[#00A572]" />
                    <Text className="text-neutral-900 font-lato-bold">{property.pstatus === '1' ? 'Available' : property.pstatus || '—'}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row">
                <View className="flex-1 p-4 border-r border-neutral-200">
                  <Text className="text-[10px] font-lato-bold tracking-[0.18em] text-neutral-500 uppercase">Floor(s)</Text>
                  <Text className="text-neutral-900 font-lato-bold mt-1">{property.pFloor || '—'}</Text>
                </View>
                <View className="flex-1 p-4">
                  <Text className="text-[10px] font-lato-bold tracking-[0.18em] text-neutral-500 uppercase">Size</Text>
                  <Text className="text-neutral-900 font-lato-bold mt-1">{property.pSize || '—'}</Text>
                </View>
              </View>
            </View>
          </SlideIn>

          <SlideIn value={stagger[2]}>
            <View className="mt-7 flex-row items-end justify-between">
              <View>
                <Text className="text-[11px] font-lato-bold tracking-[0.18em] text-neutral-500 uppercase">Opportunity</Text>
                <Text className="text-primary-700 text-xl font-lato-black mt-1">{property.pMessage || 'N/A'}</Text>
              </View>
              <View className="flex-row items-center gap-1.5 mb-1">
                <CheckCircle2 size={15} color="#00A572" />
                <Text className="text-[#00A572] font-lato-bold text-sm">Verified</Text>
              </View>
            </View>
          </SlideIn>

          <SlideIn value={stagger[3]}>
            <View className="mt-8 pt-6 border-t border-neutral-200">
              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-neutral-900 text-xl font-lato-black">About This Property</Text>
              </View>
              <Text className="text-neutral-700 text-base leading-7 font-lato">
                {property.pMessage || 'No description available.'}
              </Text>
            </View>
          </SlideIn>
        </View>
      </ScrollView>

      <View
        className="bg-white px-5 pt-3 pb-5 border-t-[0.5px] border-neutral-200"
        style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: -4 }, elevation: 8 }}
      >
        <Button
          title="Submit Inquiry"
          onPress={() => setSheetVisible(true)}
          className="py-4"
          icon={<ChevronRight color="white" />}
          iconPosition="right"
        />
      </View>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <Text className="text-xl font-lato-bold text-neutral-900 mb-2">Submit Request</Text>
        <Text className="text-neutral-600 mb-6">Fill in your details to submit a franchise inquiry request for {property.pName}.</Text>
        <Button title="Submit" onPress={() => setSheetVisible(false)} />
      </BottomSheet>
    </View>
  );
}
