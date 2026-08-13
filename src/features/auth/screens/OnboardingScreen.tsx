import { useState, useRef } from 'react';
import { View, Text, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../shared/types/navigation';
import { ArrowRight } from 'lucide-react-native';
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=900&fit=crop',
    title: 'Discover Premium Franchise Opportunities',
    subtitle: 'Access vetted global brands and invest in proven business models with confidence.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=900&fit=crop',
    title: 'Connect with Industry Leaders',
    subtitle: 'Network with top franchisors and get expert guidance every step of the way.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=900&fit=crop',
    title: 'Build Your Empire Today',
    subtitle: 'Join thousands of successful franchise owners worldwide and start your journey.',
  },
];

export function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('RoleSelection');
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View className="flex-1 bg-primary-900">
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item.image }}
            className="w-screen flex-1 justify-end pb-40"
            resizeMode="cover"
          >
            <View className="absolute inset-0 bg-black/40" />
            <View className="px-8 relative z-10">
              <Text className="text-white text-3xl font-lato-bold leading-[38px] mb-3">
                {item.title}
              </Text>
              <Text className="text-white/80 text-base leading-6">
                {item.subtitle}
              </Text>
            </View>
          </ImageBackground>
        )}
      />

      <View className="absolute bottom-12 left-0 right-0 px-8">
        <View className="flex-row gap-2 mb-6">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === currentIndex ? 'w-8 bg-primary-700' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary-700 rounded-2xl py-4 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-lato-bold text-base">
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" className="ml-2" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
