import { View, Text, TouchableOpacity, Image } from "react-native"
import { Menu } from 'lucide-react-native'
import Avatar from "./Avatar"
import { DrawerActions, useNavigation } from '@react-navigation/native';

function AppHeader() {
  const navigation = useNavigation()
  return (
    <View
      className="border-b-[0.5px] border-neutral-500 bg-primary-900 p-3 pb-4">
      <View className="flex flex-row-reverse items-center justify-between gap-3">
        <View>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Menu color="white" />
          </TouchableOpacity>
        </View>

        <View>
          <Image className="w-[200px]" resizeMode="stretch" source={require("../../../assets/FranchiseLogo.png")} />
        </View>
      </View>
    </View>
  )
}

export default AppHeader
