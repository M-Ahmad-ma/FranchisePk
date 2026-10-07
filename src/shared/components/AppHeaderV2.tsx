import { Menu } from "lucide-react-native";
import { ReactNode } from "react";
import { View, ImageSourcePropType, Image, TouchableOpacity } from "react-native";
import { CommonActions, DrawerActions, useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  containerClassName?: string;
  Logo?: ImageSourcePropType;
  icon?: ReactNode;
  rightElement?: ReactNode;
  /**
   * Overrides the default logo behaviour. By default the logo acts as a
   * "back to the investor app" button on every screen.
   */
  onLogoPress?: () => void;
}

const AppHeaderV2: React.FC<AppHeaderProps> = ({
  containerClassName = "px-4 py-2",
  Logo,
  rightElement,
  onLogoPress,
}) => {
  const navigation = useNavigation();

  /**
   * Default logo behaviour, applied on every screen that renders this header.
   *
   * Walks up the navigation chain looking for the navigator that owns
   * `InvestorDrawer` rather than counting hops, so inserting a navigator does
   * not break it. Dispatches a `reset`, not a `navigate`, so the whole brand
   * session is dropped instead of being left stacked behind InvestorDrawer —
   * this matches the existing "Home" item in BrandDrawer.
   */
  const goToInvestorApp = () => {
    let current: any = navigation;
    while (current) {
      if (current.getState?.()?.routeNames?.includes('InvestorDrawer')) {
        current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'InvestorDrawer' }],
          }),
        );
        return;
      }
      current = current.getParent?.();
    }
  };

  const handleLogoPress = onLogoPress ?? goToInvestorApp;

  return (
    <View className={containerClassName}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Menu color="white" />
        </TouchableOpacity>
      </View>
      {/* Always a TouchableOpacity so the logo is tappable everywhere, and
          flex-shrink-0 so it cannot be squeezed out of existence by a
          headerRight element in this justify-between row. */}
      <TouchableOpacity onPress={handleLogoPress} activeOpacity={0.7}>
        <Image
          className="h-11 w-[220px] flex-shrink-0"
          resizeMode="contain"
          source={Logo}
        />
      </TouchableOpacity>
      {rightElement ? <View>{rightElement}</View> : null}
    </View>
  );
};

export default AppHeaderV2;
