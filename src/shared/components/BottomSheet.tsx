import { useEffect, useCallback, useRef } from 'react';
import { Modal, View, Pressable, Dimensions, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const showModal = useCallback(() => {
    translateY.value = withTiming(0, { duration: 300 });
  }, [translateY]);

  const hideModal = useCallback(() => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
  }, [translateY, onClose]);

  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      translateY.value = SCREEN_HEIGHT;
    }
  }, [visible, showModal, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={hideModal}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={hideModal}>
        <View className="flex-1 bg-black/50" />
      </Pressable>
      <Animated.View
        style={[animatedStyle]}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80%]"
      >
        <View className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-4" />
        <ScrollView
          style={{ maxHeight: SCREEN_HEIGHT * 0.62 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
