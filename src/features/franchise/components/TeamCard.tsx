import { Image, View, Text, TouchableOpacity } from "react-native"
import { TeamCardProps } from "../../../shared/types"
import Button from "../../../shared/components/Button"
import { Mail } from "lucide-react-native"


function TeamCard({ image, name, role, containerClassName, onContact }: TeamCardProps) {
  return (
    <View className={`flex flex-row bg-white rounded-xl items-center gap-10 p-4 ${containerClassName}`} style={{
      shadowColor: "#000",
      elevation: 2
    }}>

      <View className="w-24 h-24 rounded-full overflow-hidden">
        <Image
          source={image}
          className="w-24 h-24 rounded-lg"
          resizeMode="cover"
          alt="image"
        />
      </View>


      <View>
        <View className="border-b-[0.5px] pb-1 mt-6  border-b-primary-400">
          <Text className="text-2xl font-lato-bold">{name}</Text>
          <Text className="font-lato text-lg text-neutral-700">{role}</Text>
        </View>

        <View className="mt-5 ">
          <Button title="Contact" className="w-[80%]" variant="primary" onPress={onContact} />
        </View>
      </View>
    </View>
  )
}

export default TeamCard
