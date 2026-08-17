import { View, Text } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { Store } from 'lucide-react-native';

export function BrandFranchisesScreen() {
  return (
    <MainLayout>
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-16 h-16 rounded-2xl bg-secondary-200 items-center justify-center mb-5">
          <Store size={28} color="#FD8E3A" />
        </View>
        <Text className="text-neutral-900 text-xl font-lato-bold text-center">
          My Franchises
        </Text>
        <Text className="text-neutral-500 text-sm text-center mt-2 leading-5">
          Manage your franchise listings, investments and performance.
        </Text>
      </View>
    </MainLayout>
  );
}
