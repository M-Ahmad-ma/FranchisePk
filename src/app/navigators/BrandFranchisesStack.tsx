import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BrandCompaniesListScreen } from '../../features/brand/screens/BrandCompaniesListScreen';
import { BrandCompanyFormScreen } from '../../features/brand/screens/BrandCompanyFormScreen';
import type { BrandFranchisesStackParamList } from '../../shared/types/navigation';

const Stack = createNativeStackNavigator<BrandFranchisesStackParamList>();

export function BrandFranchisesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrandCompaniesList" component={BrandCompaniesListScreen} />
      <Stack.Screen name="BrandCompanyForm" component={BrandCompanyFormScreen} />
    </Stack.Navigator>
  );
}
