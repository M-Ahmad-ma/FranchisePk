import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import AppHeaderV2 from '../components/AppHeaderV2';
import { Menu } from 'lucide-react-native';
import Logo from "../../../assets/FranchiseLogo.png"

type MainLayoutProps = {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
};

export function MainLayout({ children, className = '', showHeader = true }: MainLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`flex-1 bg-light ${className}`}
      style={{ paddingTop: showHeader ? insets.top : 0 }}
    >
      {showHeader && <AppHeaderV2 containerClassName='p-5 bg-primary-900 flex items-center flex-row gap-9' icon={<Menu color="white" />} Logo={Logo} />}
      {children}
    </View>
  );
}
