import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';

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
      {showHeader && <AppHeader />}
      {children}
    </View>
  );
}
