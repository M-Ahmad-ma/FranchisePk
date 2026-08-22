// src/components/Carousel.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import { ArrowRight, ChevronRight } from 'lucide-react-native';

interface CarouselProps {
  images: ImageSourcePropType[];
  interval?: number;
  autoPlay?: boolean;
  showDots?: boolean;
  dotColor?: string;
  activeDotColor?: string;
  height?: number;
  onItemPress?: (index: number) => void;
  onIndexChange?: (index: number) => void;
  className?: string;
  imageClassName?: string;
  dotContainerClassName?: string;
  // New card props
  card?: boolean;
  cardBorderRadius?: number;
  cardMargin?: number;
  cardShadow?: boolean;
  // Overlay arrow props
  showOverlayArrow?: boolean;
  overlayLabel?: string;
  overlayClassName?: string;
  overlayDim?: number;
  onOverlayPress?: () => void;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  interval = 3000,
  autoPlay = true,
  showDots = true,
  dotColor = 'bg-neutral-400',
  activeDotColor = 'bg-primary-700',
  height = 400,
  onItemPress,
  onIndexChange,
  className = '',
  imageClassName = '',
  dotContainerClassName = '',
  card = true,
  cardBorderRadius = 15,
  cardMargin = 16,
  cardShadow = true,
  showOverlayArrow = false,
  overlayLabel = 'View All',
  overlayClassName = '',
  overlayDim = 0.25,
  onOverlayPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const isMounted = useRef(true);
  const isScrolling = useRef(false);
  const pendingIndex = useRef<number | null>(null);
  const scrollOffset = useRef(0);
  const prevImagesKey = useRef<string | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const tapHandled = useRef(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [containerWidth]);

  // Scroll to a specific index
  const scrollToIndex = useCallback((index: number, animated: boolean = true) => {
    if (
      !flatListRef.current ||
      index < 0 ||
      index >= images.length ||
      containerWidth === 0 ||
      isScrolling.current ||
      index === currentIndex
    ) {
      return;
    }
    pendingIndex.current = index;
    isScrolling.current = true;
    flatListRef.current.scrollToIndex({
      index,
      animated,
    });
  }, [images.length, containerWidth, currentIndex]);

  const goToNext = useCallback(() => {
    if (images.length === 0 || isScrolling.current) return;
    const nextIndex = (currentIndex + 1) % images.length;
    scrollToIndex(nextIndex, true);
  }, [currentIndex, images.length, scrollToIndex]);

  // Auto‑play
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || images.length <= 1 || !isMounted.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isDragging.current && isMounted.current) {
        goToNext();
      }
    }, interval);
  }, [autoPlay, interval, images.length, goToNext]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Manage timer lifecycle
  useEffect(() => {
    isMounted.current = true;
    startAutoPlay();
    return () => {
      isMounted.current = false;
      stopAutoPlay();
    };
  }, [startAutoPlay, stopAutoPlay]);

  // Reset to first image when images change
  useEffect(() => {
    const key = images
      .map((img, i) => {
        const src = img as { uri?: string } | undefined;
        return src?.uri || `idx-${i}`;
      })
      .join('|');
    if (key === prevImagesKey.current) return;
    prevImagesKey.current = key;

    if (images.length > 0) {
      setCurrentIndex(0);
      onIndexChange?.(0);
      if (flatListRef.current && containerWidth > 0) {
        isScrolling.current = true;
        scrollOffset.current = 0;
        flatListRef.current.scrollToIndex({ index: 0, animated: false });
        setTimeout(() => {
          isScrolling.current = false;
          pendingIndex.current = null;
        }, 100);
      }
    }
  }, [images, containerWidth, onIndexChange]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.x;
  }, []);

  const onMomentumScrollEnd = useCallback(() => {
    isScrolling.current = false;
    if (pendingIndex.current !== null) {
      setCurrentIndex(pendingIndex.current);
      onIndexChange?.(pendingIndex.current);
      pendingIndex.current = null;
      return;
    }
    if (containerWidth > 0) {
      const newIndex = Math.round(scrollOffset.current / containerWidth);
      const clamped = Math.min(Math.max(newIndex, 0), images.length - 1);
      if (clamped !== currentIndex) {
        setCurrentIndex(clamped);
        onIndexChange?.(clamped);
      }
    }
  }, [containerWidth, currentIndex, images.length, onIndexChange]);

  const onMomentumScrollBegin = useCallback(() => {
    isScrolling.current = true;
  }, []);

  // Render each item – now card‑aware
  const renderItem = useCallback(({ item, index }: { item: ImageSourcePropType; index: number }) => {
    const cardHorizontalPadding = card ? cardMargin : 0;
    const cardWidth = containerWidth - cardHorizontalPadding * 1;
    const cardHeight = card ? height - cardMargin * 0.55 : height;

    const shadowStyle = card && cardShadow ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    } : {};

    return (
      <TouchableOpacity
        style={{
          width: containerWidth,
          height: height,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={0.9}
        disabled={!onItemPress}
        onPressIn={(e) => {
          touchStart.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
        }}
        onPressOut={(e) => {
          if (!onItemPress || !touchStart.current) return;
          const dx = Math.abs(e.nativeEvent.pageX - touchStart.current.x);
          const dy = Math.abs(e.nativeEvent.pageY - touchStart.current.y);
          touchStart.current = null;
          if (dx < 10 && dy < 10) {
            tapHandled.current = Date.now();
            onItemPress(index);
          }
        }}
        onPress={() => {
          if (Date.now() - tapHandled.current > 400) {
            onItemPress?.(index);
          }
        }}
      >
        <View
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: card ? cardBorderRadius : 0,
            overflow: 'hidden',
            ...shadowStyle,
          }}
        >
          <Image
            source={item}
            className={`w-full h-full ${imageClassName}`}
            resizeMode="cover"
            style={{
              borderRadius: card ? cardBorderRadius : 0,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }, [containerWidth, height, card, cardMargin, cardBorderRadius, cardShadow, onItemPress, imageClassName]);

  // Dots render (unchanged)
  const renderDots = useCallback(() => {
    if (!showDots || images.length <= 1) return null;
    return (
      <View
        className={`absolute bottom-4 w-full flex-row justify-center items-center ${dotContainerClassName}`}
        pointerEvents="none"
      >
        <View className="flex-row items-center bg-white/70 rounded-full px-3 py-2">
          {images.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                className={`mx-1 rounded-full ${isActive ? activeDotColor : dotColor}`}
                style={{
                  width: isActive ? 22 : 7,
                  height: 7,
                  transform: isActive ? [{ scaleY: 1.1 }] : [],
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }, [showDots, images.length, currentIndex, activeDotColor, dotColor, dotContainerClassName]);

  // Placeholder while measuring
  if (containerWidth === 0) {
    return (
      <View
        className={`relative ${className}`}
        style={{ width: '100%', height }}
        onLayout={onLayout}
      />
    );
  }

  const renderOverlayArrow = () => {
    if (!showOverlayArrow || !onOverlayPress) return null;

    return (
      <View
        pointerEvents="box-none"
        style={StyleSheet.absoluteFill}
        className={overlayClassName}
      >
        {/* Dim layer – visual only, never intercepts touches */}
        <View
          pointerEvents="none"
          style={{ ...StyleSheet.absoluteFill, backgroundColor: `rgba(0,0,0,${overlayDim})` }}
        />

        <TouchableOpacity
          onPress={onOverlayPress}
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderRadius: 999,
            paddingLeft: 16,
            paddingRight: 6,
            paddingVertical: 6,
          }}
        >
          <View className="w-8 h-8 rounded-full  items-center justify-center">
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      className={`relative ${className}`}
      style={{ width: '100%', height }}
      onLayout={onLayout}
    >
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(_, index) => index.toString()}
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          isDragging.current = true;
          stopAutoPlay();
        }}
        onScrollEndDrag={() => {
          isDragging.current = false;
          if (autoPlay) startAutoPlay();
        }}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: containerWidth,
          offset: containerWidth * index,
          index,
        })}
        initialScrollIndex={0}
        extraData={containerWidth}
      />
      {renderDots()}
      {renderOverlayArrow()}
    </View>
  );
};

export default Carousel;
