import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 relative bg-primary-100"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {children}
    </View>
  );
}
