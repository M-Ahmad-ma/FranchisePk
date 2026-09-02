import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { imageUrl } from '../../../shared/api/imageUrl';
import { Skeleton } from '../../../shared/components/Skeleton';

type Testimonial = {
  t_id: string;
  t_name: string;
  t_position: string;
  t_img: string;
  t_description: string;
  t_created_date?: string;
};

type Props = {
  testimonials: Testimonial[];
  isLoading?: boolean;
};

const CARD_GAP = 16;
const AVATAR_SIZE = 44;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Avatar({ uri, name, size = AVATAR_SIZE }: { uri?: string; name: string; size?: number }) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    );
  }
  return (
    <View
      className="items-center justify-center bg-primary-900"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text className="text-amber-500 font-lato-black text-lg">
        {initials(name)}
      </Text>
    </View>
  );
}

export function TestimonialsSection({ testimonials, isLoading }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 20; // full width minus margins
  const scrollRef = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);

  if (!isLoading && testimonials.length === 0) return null;

  const onMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offset = e.nativeEvent.contentOffset.x;
    setActive(Math.round(offset / (cardWidth + CARD_GAP)));
  };

  return (
    <View className="mb-12 mt-9 relative">
      <View
        pointerEvents="none"
        className="absolute -left-24 -bottom-8"
        style={{
          width: width * 0.8,
          height: width * 0.8,
          borderRadius: width * 0.4,
          backgroundColor: 'rgba(82,121,172,0.07)',
        }}
      />
      <View
        pointerEvents="none"
        className="absolute -right-14 -top-6"
        style={{
          width: width * 0.5,
          height: width * 0.5,
          borderRadius: width * 0.25,
          backgroundColor: 'rgba(0,165,114,0.05)',
        }}
      />

      <View className="px-6 mb-6">
        <Text className="text-primary-700 font-lato-bold text-xs tracking-[3px] uppercase mb-1">
          Success Stories
        </Text>
        <Text className="text-neutral-900 text-[26px] leading-[30px] font-lato-black">
          What our Partners say
        </Text>
        <Text className="text-neutral-600 font-lato text-[13px] mt-1">
          Real voices from the franchise network
        </Text>
      </View>

      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[0, 1].map((i) => (
            <View
              key={i}
              className="bg-white rounded-[28px] border border-neutral-200 overflow-hidden"
              style={{ width: cardWidth, height: 240, marginRight: CARD_GAP }}
            >
              <View className="p-6 flex-1 justify-center">
                <Skeleton className="w-full h-5 mb-3" />
                <Skeleton className="w-full h-5 mb-3" />
                <Skeleton className="w-3/4 h-5 mb-6" />
                <View className="flex-row items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <View>
                    <Skeleton className="w-24 h-4 mb-1" />
                    <Skeleton className="w-16 h-3" />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth + CARD_GAP}
            snapToAlignment="start"
            decelerationRate="fast"
            onMomentumScrollEnd={onMomentumScrollEnd}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          >
            {testimonials.map((t) => {
              const avatar = imageUrl(t.t_img);
              return (
                <View
                  key={t.t_id}
                  className="bg-white mb-1 rounded-[28px] overflow-hidden"
                  style={{
                    width: cardWidth,
                    minHeight: 100,
                    marginRight: CARD_GAP,
                    shadowColor: '#0A1A3D',
                    shadowOpacity: 0.08,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 4,
                    padding: 24,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    className="text-neutral-200 font-lato-black absolute"
                    style={{ fontSize: 72, top: 12, left: 16, lineHeight: 72 }}
                  >
                    “
                  </Text>

                  <Text
                    className="text-neutral-800 font-lato text-[10px] leading-[16px] mt-2"
                    style={{ fontStyle: 'italic' }}
                  >
                    “{t.t_description}”
                  </Text>

                  <View
                    className="w-12 h-[2px] rounded-full my-5"
                    style={{ backgroundColor: '#F0B429' }}
                  />

                  <View className="flex-row items-center">
                    <Avatar uri={avatar} name={t.t_name} size={AVATAR_SIZE} />
                    <View className="ml-3">
                      <Text className="text-neutral-900 font-lato-black text-base">
                        {t.t_name}
                      </Text>
                      <Text className="text-neutral-500 font-lato text-[13px]">
                        {t.t_position}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {testimonials.length > 1 && (
            <View className="flex-row gap-2 items-center justify-center mt-5">
              {testimonials.map((t, i) => (
                <View
                  key={t.t_id}
                  className="rounded-full"
                  style={{
                    width: i === active ? 24 : 7,
                    height: 7,
                    backgroundColor: i === active ? '#5279AC' : '#DAE2FD',
                  }}
                />
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}
