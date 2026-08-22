import { FlatList, Text, View, TouchableOpacity, Platform } from "react-native"
import { MainLayout } from "../../../shared/layouts/MainLayout"
import { useEffect, useState } from "react"
import PropertyCard from "../components/PropertiesCard"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { PropertiesStackParamList } from "../../../shared/types/navigation"
import BottomSheet from "../../../shared/components/BottomSheet"
import AddPropertySheet from "../components/AddPropertySheet"
import { useProperties } from "../../../shared/hooks/useProperties"
import { imageUrl } from "../../../shared/api/imageUrl"
import { paginate, hasMore } from "../../../shared/utils/franchise"
import { Skeleton } from "../../../shared/components/Skeleton"
import { HousePlus } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PAGE_SIZE = 6

function Properties() {
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navigation = useNavigation<NativeStackNavigationProp<PropertiesStackParamList>>()
  const insets = useSafeAreaInsets()
  const { data, isLoading, isError } = useProperties()
  const [sheetVisible, setSheetVisible] = useState(false)

  const properties = data?.property ?? []
  const visibleProperties = paginate(properties, page, PAGE_SIZE)
  const hasMoreItems = hasMore(properties, page, PAGE_SIZE)

  useEffect(() => {
    setIsLoadingMore(false)
  }, [page])

  const loadMore = () => {
    if (!hasMoreItems || isLoadingMore) return
    setIsLoadingMore(true)
    setPage((p) => p + 1)
  }

  const renderHeader = () => (
    <View className="pt-8 pb-6 px-4">
      <Text className="text-[11px] font-lato-bold tracking-[0.22em] text-primary-700 uppercase">
        Premium Portfolio
      </Text>
      <Text className="text-[34px] leading-[40px] font-lato-black text-neutral-dark2 mt-2">
        Featured Properties
      </Text>
      <Text className="text-neutral-600 text-base font-lato mt-2 leading-6">
        Hand-picked commercial spaces for investors and global brands.
      </Text>
    </View>
  )

  const renderFooter = () => {
    if (isLoadingMore && hasMoreItems) {
      return (
        <View>
          {[0, 1].map((i) => (
            <View key={i} className="bg-white rounded-2xl overflow-hidden mx-4 mb-4">
              <Skeleton className="w-full h-48 rounded-none" />
              <View className="px-4 py-4">
                <Skeleton className="w-24 h-3 mb-2" />
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4" />
              </View>
            </View>
          ))}
        </View>
      )
    }
    return null
  }

  return (
    <MainLayout>
      <FlatList
        data={visibleProperties}
        keyExtractor={(item) => item.p_id}
        renderItem={({ item }) => (
          <PropertyCard
            id={Number(item.p_id) || 0}
            title={item.pName}
            description={item.pMessage || ''}
            marketValue={'N/A'}
            tag={'Commercial'}
            details={{ type: '', size: item.pSize || '', yield: '' }}
            imageUrl={imageUrl(item.pimage)}
            city={item.Pcity}
            address={item.sAddress}
            floors={item.pFloor ? item.pFloor.split(',').map((f) => f.trim()) : undefined}
            status={item.pstatus === '1' ? 'Available' : item.pstatus ? 'Unavailable' : undefined}
            onPress={() => navigation.navigate('PropertyDetail', { id: item.p_id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[0, 1, 2].map((i) => (
                <View key={i} className="bg-white rounded-2xl overflow-hidden mx-4 mb-4">
                  <Skeleton className="w-full h-48 rounded-none" />
                  <View className="px-4 py-4">
                    <Skeleton className="w-24 h-3 mb-2" />
                    <Skeleton className="w-3/4 h-6 mb-2" />
                    <Skeleton className="w-1/2 h-4" />
                  </View>
                </View>
              ))}
            </View>
          ) : isError ? (
            <View className="items-center py-20">
              <Text className="text-neutral-500">Unable to load properties.</Text>
            </View>
          ) : (
            <View className="items-center py-20">
              <Text className="text-neutral-500">No properties found.</Text>
            </View>
          )
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <TouchableOpacity
        onPress={() => setSheetVisible(true)}
        activeOpacity={0.8}
        className="absolute right-5 w-20 h-20 rounded-full bg-primary-700 items-center justify-center shadow-lg"
        style={{
          bottom: insets.bottom + (Platform.OS === 'ios' ? 24 : 20),
          shadowColor: '#436CF5',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <HousePlus size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <AddPropertySheet onClose={() => setSheetVisible(false)} />
      </BottomSheet>
    </MainLayout>
  )
}

export default Properties
