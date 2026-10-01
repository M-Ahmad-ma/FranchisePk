import { ScrollView, Text, View, Image, RefreshControl } from 'react-native';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { usePartners } from '../../../shared/hooks/useContent';
import { partnerLogoUrl } from '../../../shared/api/imageUrl';
import { Skeleton } from '../../../shared/components/Skeleton';
import UserAvatar from '../../../shared/components/UserAvatar';
import { useRefresh } from '../../../shared/hooks/useRefresh';
import { ErrorRetry } from '../../../shared/components/ErrorRetry';

export function Partners() {
  const partnersQuery = usePartners();
  const { data, isLoading, isError } = partnersQuery;
  const { refreshing, onRefresh } = useRefresh(partnersQuery);

  return (
    <MainLayout showHeader={true} headerRight={
      <UserAvatar />
    }>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5279AC']}
            tintColor="#5279AC"
          />
        }
      >
        <View className="px-6 pt-8 pb-2">
          <Text className="text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase mb-3">
            Trusted Partners
          </Text>
          <View className="flex-row items-start gap-4">
            <View className="flex-1">
              <Text className="text-neutral-900 text-4xl font-lato-bold leading-[44px]">
                Backed by the world's best
              </Text>
              <Text className="text-neutral-600 text-base font-normal mt-3 leading-6">
                We partner with industry-leading franchise brands to bring you verified,
                high-growth investment opportunities across every sector.
              </Text>
            </View>
          </View>
        </View>

        {isLoading && (
          <View className="flex-col px-4 mt-6 pb-8">
            {[0, 1, 2, 3].map((i) => (
              <View key={i} className="w-full px-2 mb-4">
                <Skeleton className="w-full h-28 rounded-2xl" />
              </View>
            ))}
          </View>
        )}

        {isError && (
          <ErrorRetry message="Unable to load partners." onRetry={onRefresh} />
        )}

        {data && (
          <View className="flex-col px-4 mt-6 pb-8">
            {data.partners?.map((partner) => (
              <View key={partner.id} className="w-fit px-2 mb-4">
                <View className="w-full h-28  rounded-2xl border border-neutral-200 p-1 items-center justify-center overflow-hidden">
                  <Image
                    source={{ uri: partnerLogoUrl(partner.partner_logo) }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
}
