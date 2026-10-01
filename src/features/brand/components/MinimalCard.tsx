import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Pencil } from 'lucide-react-native';

// Define the shape of the data based on your API response
interface CompanyContact {
  con_p_name: string;
  con_desgnation: string;
  con_email: string;
  con_mobilenumber: string;
}

interface CompanyImage {
  img_name: string;
}

interface CompanyData {
  co_id: string;
  co_name: string;
  company_contacts?: CompanyContact[];
  company_images?: CompanyImage[];
}

interface MinimalCardProps {
  company: CompanyData;
  imageUrl?: any;
  onPress: () => void;
  onEdit: () => void;
}

export function MinimalCard({
  company,
  imageUrl,
  onPress,
  onEdit,
}: MinimalCardProps) {
  // Safely extract the first contact and image
  const contact = company?.company_contacts?.[0];
  const hasImage = !!imageUrl;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-4 bg-white rounded-2xl border border-neutral-200 p-4 mb-3"
    >
      {/* Image / Avatar Section */}
      <View className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-200 items-center justify-center">
        {hasImage ? (
          <Image source={imageUrl} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Text className="text-neutral-500 font-lato-bold text-xl">
            {company?.co_name?.trim()?.charAt(0) || 'C'}
          </Text>
        )}
      </View>

      {/* Details Section */}
      <View className="flex-1 min-w-0 justify-center">
        {/* Top Row: Company Name & Phone */}
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className="text-base font-lato-bold text-neutral-900 flex-1 mr-2"
            numberOfLines={1}
          >
            {company?.co_name?.trim() || 'Unnamed Company'}
          </Text>

          {contact?.con_mobilenumber && (
            <Text className="text-xs font-lato text-neutral-500">
              {contact.con_mobilenumber}
            </Text>
          )}
        </View>

        {/* Middle Row: Contact Person & Designation */}
        {(contact?.con_p_name || contact?.con_desgnation) && (
          <Text className="text-sm font-lato text-neutral-600 mb-1" numberOfLines={1}>
            {contact.con_p_name}
            {contact.con_p_name && contact.con_desgnation ? ' • ' : ''}
            {contact.con_desgnation}
          </Text>
        )}

        {/* Bottom Row: Email */}
        {contact?.con_email && (
          <Text className="text-sm font-lato text-primary-700" numberOfLines={1}>
            {contact.con_email}
          </Text>
        )}
      </View>

      {/* Edit Action */}
      <TouchableOpacity
        className="w-10 h-10 rounded-full bg-primary-200 items-center justify-center"
        activeOpacity={0.7}
        onPress={onEdit}
        hitSlop={8}
        accessibilityLabel="Edit company"
      >
        <Pencil size={16} color="#386092" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
