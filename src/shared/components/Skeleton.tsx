import React, { useEffect, useId, useRef } from 'react';
import { Animated, Easing, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  width,
  height,
  borderRadius,
  className,
  style,
}: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;
  const rawId = useId();
  const gradientId = `skeleton-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1800,       // slightly slower, feels calmer
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-260, 320],
  });

  return (
    <View
      className={className}
      style={[
        { backgroundColor: '#EBF1FF', overflow: 'hidden' },
        width !== undefined && { width },
        height !== undefined && { height },
        borderRadius !== undefined && { borderRadius },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -40,
          bottom: -40,
          width: 140,           // wider strip = softer, less "flash"
          transform: [{ translateX }, { skewX: '-20deg' }],
        }}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              {/* lower peak opacity + wider falloff = gentler shimmer */}
              <Stop offset="0" stopColor="rgba(255,255,255,0)" />
              <Stop offset="0.25" stopColor="rgba(255,255,255,0)" />
              <Stop offset="0.5" stopColor="rgba(255,255,255,0.18)" />
              <Stop offset="0.75" stopColor="rgba(255,255,255,0)" />
              <Stop offset="1" stopColor="rgba(255,255,255,0)" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
        </Svg>
      </Animated.View>
    </View>
  );
}
