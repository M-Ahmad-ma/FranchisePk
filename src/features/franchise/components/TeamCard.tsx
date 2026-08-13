import { Image, View, Text, TouchableOpacity } from "react-native"
import { TeamCardProps } from "../../../shared/types"
import Button from "../../../shared/components/Button"
import { Mail } from "lucide-react-native"


function TeamCard({ image, name, role, containerClassName, onContact }: TeamCardProps) {
  return (
    <View className={`bg-white rounded-lg p-4 ${containerClassName}`}>

      <Image
        source={image}
        className="w-full h-56 rounded-lg"
        resizeMode="cover"
      />

      <View className="border-b-[0.5px] pb-1 mt-6  border-b-primary-400">
        <Text className="text-2xl font-lato-bold">{name}</Text>
        <Text className="font-lato text-lg text-neutral-700">{role}</Text>
      </View>

      <View className="mt-5 flex items-center flex-row gap-4">
        <Button title="Contact" className="w-1/2" variant="primary" onPress={onContact} />
        <TouchableOpacity>
          <Mail color="#5279AC" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TeamCard
