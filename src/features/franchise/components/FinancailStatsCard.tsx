import { ImageOff } from "lucide-react-native";
import { View, Text, Image, ImageSourcePropType } from "react-native";

interface CardStats {
  image?: ImageSourcePropType;
  label: string;
  amount?: string;
  className?: string
}

export default function FinancailStatsCard({ image, label, amount, className }: CardStats) {
  return (
    <View className={`rounded-xl border border-neutral-200 mt-5 p-1 mr-3 w-48 flex-shrink-0 ${className}`}>
      {image ? (
        <Image source={image} className="w-full h-56 rounded-lg" resizeMode="cover" />
      ) : (
        <View className="w-full h-56 rounded-lg bg-neutral-200 flex items-center justify-center">
          <ImageOff color='#8990A8' />
        </View>
      )}
      <View className="ml-3 flex-1 mt-3">
        <Text className="text-xs uppercase text-neutral-500 font-lato-bold tracking-wider">
          {label}
        </Text>
        <Text className="text-sm font-lato-bold text-neutral-900 mt-1">
          {amount || 'N/A'}
        </Text>
      </View>
    </View>
  );
}
