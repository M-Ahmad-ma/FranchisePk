import { ArrowUpRight, Home } from "lucide-react-native";
import { ReactNode } from "react"
import { View, Text, TouchableOpacity } from "react-native"

interface QuickActionProp {
  icon: ReactNode;
  title: string;
  description: string;
  bgcolor?: string;
  containerClassName?: string;
  onPress: () => void;
}

function QuickAction({ icon, title, description, bgcolor, containerClassName, onPress }: QuickActionProp) {
  const baseClasses = `rounded-2xl h-48 ml-2 w-1/2 mb-1`;
  const bgClass = bgcolor ? `bg-${bgcolor}` : '';
  const containerCls = containerClassName || '';

  return (
    <TouchableOpacity onPress={onPress} className={`${baseClasses}  ${containerCls}`} style={{
      shadowColor: "#000",
      elevation: 3
    }}>
      <View className="absolute top-4 left-3 rounded-2xl p-2 bg-[#e5eef8]">
        {icon || <Home />}
      </View>
      <View className="absolute right-4 top-3">
        <ArrowUpRight color="#8990A8" size={18} />
      </View>


      <View className="absolute bottom-5 left-5">
        <Text className="font-lato-bold mb-2">{title}</Text>
        <Text className="font-lato-light text-sm text-neutral-700">{description}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default QuickAction
