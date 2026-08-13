import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FranchiseListScreen } from '../../features/franchise/screens/FranchiseListScreen';
import { CompanyDetailScreen } from '../../features/franchise/screens/CompanyDetailScreen';
import type { FranchiseStackParamList } from '../../shared/types/navigation';

const Stack = createNativeStackNavigator<FranchiseStackParamList>();

export function FranchiseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FranchiseList" component={FranchiseListScreen} />
      <Stack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
    </Stack.Navigator>
  );
}
