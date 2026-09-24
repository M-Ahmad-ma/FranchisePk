import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeaderV2 from '../components/AppHeaderV2';
import { Menu } from 'lucide-react-native';
import Logo from "../../../assets/FranchiseLogo.png"
import type { ReactNode } from 'react';

type MainLayoutProps = {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  headerRight?: ReactNode;
};

export function MainLayout({ children, className = '', showHeader = true, headerRight }: MainLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`flex-1 bg-light ${className}`}
      style={{ paddingTop: showHeader ? insets.top : 0 }}
    >
      {showHeader && <AppHeaderV2 containerClassName='px-3 py-5 bg-primary-900 flex items-center flex-row justify-between' icon={<Menu color="white" />} Logo={Logo} rightElement={headerRight} />}
      {children}
    </View>
  );
}
