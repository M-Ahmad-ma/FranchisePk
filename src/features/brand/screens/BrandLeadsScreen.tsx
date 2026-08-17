import { View, Text } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { Users } from 'lucide-react-native';

export function BrandLeadsScreen() {
  return (
    <MainLayout>
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-16 h-16 rounded-2xl bg-tertiary-200 items-center justify-center mb-5">
          <Users size={28} color="#0F9CC9" />
        </View>
        <Text className="text-neutral-900 text-xl font-lato-bold text-center">
          Investor Leads
        </Text>
        <Text className="text-neutral-500 text-sm text-center mt-2 leading-5">
          Qualified investors interested in your franchises will appear here.
        </Text>
      </View>
    </MainLayout>
  );
}
