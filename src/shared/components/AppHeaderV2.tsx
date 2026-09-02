import { Menu } from "lucide-react-native";
import { ReactNode } from "react";
import { View, ImageSourcePropType, Image, TouchableOpacity } from "react-native";
import { DrawerActions, useNavigation } from '@react-navigation/native';


interface AppHeaderProps {
  containerClassName?: string;
  Logo?: ImageSourcePropType;
  icon?: ReactNode;
}

const AppHeaderV2: React.FC<AppHeaderProps> = ({
  containerClassName = "gap-2 px-4 py-2",
  Logo
}) => {
  const navigation = useNavigation()
  return (
    <View className={containerClassName}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Menu color="white" />
        </TouchableOpacity>
      </View>
      <Image className="w-[70%]" resizeMode="stretch" source={Logo} />
    </View>
  );
};

export default AppHeaderV2;
