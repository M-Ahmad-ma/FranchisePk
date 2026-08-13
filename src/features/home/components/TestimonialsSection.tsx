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
import { Star } from 'lucide-react-native';
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
const CARD_HEIGHT = 200;

function Stars() {
  return (
    <View className="flex-row gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={14} color="#F0B429" fill="#F0B429" />
      ))}
    </View>
  );
}

export function TestimonialsSection({ testimonials, isLoading }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 20;
  const imageWidth = cardWidth * 0.38;
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
    <View className="mb-8 mt-2 relative">
      <View
        pointerEvents="none"
        className="absolute -right-16 top-0"
        style={{
          width: width * 0.7,
          height: width * 0.7,
          borderRadius: width * 0.35,
          backgroundColor: 'rgba(67,108,245,0.06)',
        }}
      />
      <Text
        pointerEvents="none"
        className="absolute font-lato-black"
        style={{
          right: -10,
          top: 6,
          fontSize: 120,
          lineHeight: 130,
          color: 'rgba(82,121,172,0.08)',
        }}
      >
        "
      </Text>

      <View className="px-6 mb-5">
        <Text className="text-primary-700 font-lato-bold text-xs tracking-[3px] uppercase mb-1">
          Success Stories
        </Text>
        <Text className="text-neutral-900 text-2xl font-lato-bold leading-8">
          What our Partners say
        </Text>
      </View>

      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 28 }}
        >
          {[0, 1].map((i) => (
            <View
              key={i}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden flex-row"
              style={{ width: cardWidth, height: CARD_HEIGHT, marginRight: CARD_GAP }}
            >
              <Skeleton style={{ width: imageWidth, height: CARD_HEIGHT }} />
              <View className="flex-1 p-5 justify-center">
                <Skeleton className="w-16 h-3 mb-4" />
                <Skeleton className="w-full h-3 mb-2" />
                <Skeleton className="w-full h-3 mb-2" />
                <Skeleton className="w-3/4 h-3" />
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
                  className="bg-white  rounded-xl border mb-1 border-neutral-100 overflow-hidden flex-row gap-[0.9px]"
                  style={{
                    width: cardWidth,
                    height: CARD_HEIGHT,
                    marginRight: CARD_GAP,
                    shadowColor: '#0A1A3D',
                    shadowOpacity: 0.06,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 3,
                  }}
                >
                  {/* Photo with name/position overlay */}
                  <View style={{ width: imageWidth, height: '100%' }} className="relative">
                    <Image
                      source={avatar ? { uri: avatar } : undefined}
                      className='rounded-xl'
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-3 left-3 right-2">
                      <Text
                        numberOfLines={1}
                        className="text-white font-lato-bold text-sm"
                      >
                        {t.t_name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="text-white/80 font-lato-regular text-xs mt-0.5"
                      >
                        {t.t_position}
                      </Text>
                    </View>
                  </View>

                  {/* Stars + quote */}
                  <View className="flex-1 px-5 justify-start pt-5 bg-neutral-200 rounded-xl">
                    <Stars />
                    <Text
                      numberOfLines={6}
                      className="text-neutral-800 text-[13px] font-normal leading-5 mt-3 font-lato-regular"
                    >
                      "{t.t_description}"
                    </Text>
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
                    width: i === active ? 22 : 7,
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
