import { ScrollView, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { Briefcase, Send } from 'lucide-react-native';
import { useJobs } from '../../../shared/hooks/useContent';
import { Skeleton } from '../../../shared/components/Skeleton';

export function VacancyScreen() {
  const { data, isLoading, isError } = useJobs();

  return (
    <MainLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-2">
          <Text className="text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase mb-3">
            Join Our Team
          </Text>
          <View className="flex-row items-start gap-4">
            <View className="flex-1">
              <Text className="text-neutral-900 text-5xl font-lato-bold leading-[44px]">
                Vacancies
              </Text>
              <Text className="text-neutral-600 text-base font-lato mt-3 leading-6">
                Build your career with Franchise Pakistan and work with globally recognized franchise brands.
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-6">
          {isLoading && (
            <View>
              {[0, 1, 2].map((i) => (
                <View key={i} className="bg-white rounded-2xl border border-neutral-200 p-6 mb-4">
                  <View className="flex-row items-center mb-4">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <View className="ml-3 flex-1">
                      <Skeleton className="w-2/3 h-5 mb-2" />
                      <Skeleton className="w-1/3 h-3.5" />
                    </View>
                  </View>
                  <Skeleton className="w-full h-3.5 mb-2" />
                  <Skeleton className="w-full h-3.5 mb-2" />
                  <Skeleton className="w-4/5 h-3.5 mb-4" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </View>
              ))}
            </View>
          )}

          {isError && (
            <View className="items-center py-16">
              <Text className="text-neutral-500">Unable to load vacancies.</Text>
            </View>
          )}

          {data?.jobs?.map((job) => (
            <View key={job.j_id} className="bg-white rounded-2xl border border-neutral-200 p-6 mb-4">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-xl bg-primary-200 items-center justify-center">
                  <Briefcase size={20} color="#436CF5" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-xl font-lato-bold text-neutral-900">
                    {job.j_jobTitle}
                  </Text>
                  {job.j_brandName && (
                    <Text className="text-neutral-500 text-sm font-lato mt-0.5">{job.j_brandName}</Text>
                  )}
                </View>
              </View>
              <Text className="text-neutral-500 text-sm font-lato leading-5 mb-3">
                {job.j_qualification && `Qualification: ${job.j_qualification}`}
              </Text>
              <Text className="text-neutral-700 text-base font-lato leading-6 mb-4">
                {job.j_keyResponsiblities}
              </Text>
              {job.j_salary && (
                <View className="bg-primary-100 rounded-xl p-4 flex-row items-center mb-2">
                  <Text className="text-primary-700 text-sm font-lato-bold">
                    Salary: PKR {job.j_salary}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {data && data.jobs?.length === 0 && (
            <View className="items-center py-16">
              <Text className="text-neutral-500">No vacancies at the moment.</Text>
            </View>
          )}
        </View>

        <View className="px-6 mb-8 mt-2">
          <Text className="text-neutral-900 text-xl font-lato-bold mb-2">Send Your Application</Text>
          <Text className="text-neutral-500 text-sm mb-5">
            Fill out the form below and we'll get back to you.
          </Text>

          <View className="bg-white rounded-2xl border border-neutral-200 p-2 mb-3">
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#8990A8"
              className="px-4 py-3 text-neutral-900 text-base"
            />
          </View>
          <View className="bg-white rounded-2xl border border-neutral-200 p-2 mb-3">
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#8990A8"
              className="px-4 py-3 text-neutral-900 text-base"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View className="bg-white rounded-2xl border border-neutral-200 p-2 mb-3">
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#8990A8"
              className="px-4 py-3 text-neutral-900 text-base"
              keyboardType="phone-pad"
            />
          </View>
          <View className="bg-white rounded-2xl border border-neutral-200 p-2 mb-5">
            <TextInput
              placeholder="Tell us about yourself..."
              placeholderTextColor="#8990A8"
              className="px-4 py-3 text-neutral-900 text-base"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          </View>

          <TouchableOpacity
            className="bg-primary-700 rounded-2xl py-4 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Send size={18} color="#FFFFFF" />
            <Text className="text-white font-lato-bold text-base ml-2">Submit Application</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
}
