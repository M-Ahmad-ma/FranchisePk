import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import TeamCard from '../../franchise/components/TeamCard';
import MapView from '../../../shared/components/MapView';
import BottomSheet from '../../../shared/components/BottomSheet';
import Button from '../../../shared/components/Button';
import { useContact } from '../../../shared/hooks/useContent';
import { imageUrl } from '../../../shared/api/imageUrl';
import { Skeleton } from '../../../shared/components/Skeleton';

export function ContactUs() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ name: string; role: string } | null>(null);
  const { data, isLoading, isError } = useContact();

  const handleContact = (member: { name: string; role: string }) => {
    setSelectedMember(member);
    setSheetVisible(true);
  };

  return (
    <MainLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className='flex items-center justify-center py-9'>
          <View className=' max-w-[300px]'>
            <Text className='text-center text-4xl font-lato-bold mb-4 text-primary-900'>Let's build your empire together</Text>
            <Text className='text-center text-lg font-lato'>Whether you are a seasoned investor or launching your first location, our global team is ready to guide your expansion strategy.</Text>
          </View>
        </View>

        <View className='mt-5 px-4'>
          <Text className='text-3xl font-lato-bold'>Meet the Team</Text>
          <Text className='font-lato text-lg mt-1 text-neutral-700'>Executive leadership and expansion{'\n'}specialists.</Text>

          {isLoading && (
            <View>
              {[0, 1, 2].map((i) => (
                <View key={i} className="bg-white rounded-lg p-4 mt-5">
                  <Skeleton className="w-full h-56 rounded-lg" />
                  <View className="mt-6 pb-1 border-b-[0.5px] border-b-primary-400">
                    <Skeleton className="w-1/2 h-6 mb-2" />
                    <Skeleton className="w-1/3 h-4" />
                  </View>
                  <View className="mt-5 flex-row items-center gap-4">
                    <Skeleton className="w-1/2 h-12 rounded-xl" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                  </View>
                </View>
              ))}
            </View>
          )}

          {isError && (
            <View className="items-center py-16">
              <Text className="text-neutral-500">Unable to load team members.</Text>
            </View>
          )}

          {data?.employee?.map((emp: any, i: number) => {
            const name = emp.name || emp.emp_name || emp.contact_name || `Team Member ${i + 1}`;
            const role = emp.role || emp.emp_role || emp.designation || 'Team Member';
            const image = imageUrl(emp.image || emp.emp_image || emp.contact_image);

            return (
              <TeamCard
                key={emp.id || i}
                name={name}
                role={role}
                image={image ? { uri: image } : { uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' }}
                containerClassName='mt-5'
                onContact={() => handleContact({ name, role })}
              />
            );
          })}

          {data && (!data.employee || data.employee.length === 0) && (
            <View className="items-center py-16">
              <Text className="text-neutral-500">No team members listed yet.</Text>
            </View>
          )}
        </View>

        <View className="mt-8 px-4 mb-8">
          <View className="flex-row items-center mb-2">
            <Text className="text-2xl font-lato-bold  text-neutral-900">
              Our Location
            </Text>
          </View>
          <Text className="text-neutral-600 font-lato text-sm mb-4">
            123 Business Avenue, Suite 400, New York
          </Text>
          <MapView
            latitude={40.7128}
            longitude={-74.006}
            title="FranchisePk HQ"
            height={280}
          />
        </View>
      </ScrollView>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <Text className="text-xl font-lato-bold text-neutral-900 mb-1">Contact {selectedMember?.name}</Text>
        <Text className="text-neutral-500 text-sm mb-1">{selectedMember?.role}</Text>
        <Text className="text-neutral-600 mb-6 mt-3">Send a message to connect with {selectedMember?.name?.split(' ')[0]} about franchise opportunities.</Text>
        <Button title="Send Message" onPress={() => setSheetVisible(false)} />
      </BottomSheet>
    </MainLayout>
  );
}
