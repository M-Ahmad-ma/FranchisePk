import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Properties from '../../features/franchise/screens/Properties';
import { PropertyDetailScreen } from '../../features/franchise/screens/PropertyDetailScreen';
import type { PropertiesStackParamList } from '../../shared/types/navigation';

const Stack = createNativeStackNavigator<PropertiesStackParamList>();

export function PropertiesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PropertiesList" component={Properties} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </Stack.Navigator>
  );
}
