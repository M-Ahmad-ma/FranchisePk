import React, { useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";

/* -------------------------------------------------------------------------- */
/*  Types (match the API response)                                            */
/* -------------------------------------------------------------------------- */

export interface CompanyContact {
  con_id: string;
  con_company_id: string;
  con_date: string;
  con_desgnation: string; // (sic) spelling follows the API
  con_email: string;
  con_mobilenumber: string;
  con_p_name: string;
}

export interface CompanyImage {
  img_id: string;
  fkco_id: string;
  img_name: string;
  img_type: string;
  img_date: string;
  img_time: string;
  img_updated_date: string;
  img_udpated_time: string; // (sic)
  slider_image_name: string | null;
}

export interface Company {
  co_id: string;
  co_name: string;
  co_status: string;
  co_website_status: string;
  company_contacts: CompanyContact[];
  company_images: CompanyImage[];
  con_email?: string;
  con_mobilenumber?: string;
}

/* -------------------------------------------------------------------------- */
/*  Small internal pieces                                                     */
/* -------------------------------------------------------------------------- */

const Badge = ({ label, active }: { label: string; active: boolean }) => (
  <View
    className={`flex-row items-center rounded-full px-2.5 py-1 mr-2 ${active ? "bg-tertiary-200" : "bg-neutral-200"
      }`}
  >
    <View
      className={`h-1.5 w-1.5 rounded-full mr-1.5 ${active ? "bg-tertiary-700" : "bg-neutral-500"
        }`}
    />
    <Text
      className={`font-lato-bold text-xs ${active ? "text-tertiary-900" : "text-neutral-800"
        }`}
    >
      {label}
    </Text>
  </View>
);

const ActionButton = ({
  label,
  onPress,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    className={`flex-1 items-center justify-center rounded-xl py-3 ${variant === "primary"
      ? "bg-primary-800 active:bg-primary-900"
      : "bg-secondary-200 active:bg-secondary-300"
      }`}
  >
    <Text
      className={`font-lato-bold text-sm ${variant === "primary" ? "text-primary-100" : "text-secondary-900"
        }`}
    >
      {label}
    </Text>
  </Pressable>
);

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface CompanyCardProps {
  company: Company;
  /** Base URL where company images are hosted, e.g. "https://example.com/uploads/" */
  imageBaseUrl: string;
  /** Tap on the card body */
  onPress?: (company: Company) => void;
  /** Override default call behaviour (Linking tel:) */
  onCallPress?: (phone: string) => void;
  /** Override default email behaviour (Linking mailto:) */
  onEmailPress?: (email: string) => void;
  className?: string;
}

const CompanyCard = ({
  company,
  imageBaseUrl,
  onPress,
  onCallPress,
  onEmailPress,
  className = "",
}: CompanyCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  const name = company.co_name?.trim() ?? "";
  const contact = company.company_contacts?.[0];
  const image = company.company_images?.[0];

  // Prefer the contact record, fall back to top-level fields
  const email = contact?.con_email || company.con_email;
  const phone = contact?.con_mobilenumber || company.con_mobilenumber;

  const isActive = company.co_status === "1";
  const hasWebsite = company.co_website_status === "1";

  const imageUri =
    image?.img_name && !imageFailed
      ? `${imageBaseUrl.replace(/\/?$/, "/")}${image.img_name}`
      : null;

  const handleCall = () => {
    if (!phone) return;
    onCallPress ? onCallPress(phone) : Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = () => {
    if (!email) return;
    onEmailPress ? onEmailPress(email) : Linking.openURL(`mailto:${email}`);
  };

  return (
    <Pressable
      onPress={() => onPress?.(company)}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className={`overflow-hidden rounded-2xl border border-neutral-300 bg-primary-100 active:bg-light ${className}`}
    >
      {/* Header: logo + name + badges */}
      <View className="flex-row items-center p-4">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            onError={() => setImageFailed(true)}
            className="h-16 w-16 rounded-xl bg-neutral-200"
            resizeMode="cover"
            accessibilityLabel={`${name} logo`}
          />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-xl bg-primary-300">
            <Text className="font-lato-black text-xl text-primary-dark">
              {getInitials(name) || "?"}
            </Text>
          </View>
        )}

        <View className="ml-4 flex-1">
          <Text
            numberOfLines={1}
            className="font-lato-bold text-lg text-neutral-dark-2"
          >
            {name}
          </Text>
          <View className="mt-2 flex-row flex-wrap">
            <Badge label={isActive ? "Active" : "Inactive"} active={isActive} />
            <Badge
              label={hasWebsite ? "Website live" : "No website"}
              active={hasWebsite}
            />
          </View>
        </View>
      </View>

      {/* Contact person */}
      {contact && (
        <View className="border-t border-neutral-300 bg-light px-4 py-3">
          <Text className="font-lato-bold text-base text-neutral-dark">
            {contact.con_p_name}
          </Text>
          <Text className="font-lato text-sm text-neutral-700">
            {contact.con_desgnation}
          </Text>
          {!!email && (
            <Text numberOfLines={1} className="mt-2 font-lato text-sm text-primary-800">
              {email}
            </Text>
          )}
          {!!phone && (
            <Text className="font-lato text-sm text-neutral-800">{phone}</Text>
          )}
        </View>
      )}

      {/* Actions */}
      {(!!phone || !!email) && (
        <View className="flex-row gap-3 p-4">
          {!!phone && <ActionButton label="Call" onPress={handleCall} />}
          {!!email && (
            <ActionButton label="Send email" onPress={handleEmail} variant="secondary" />
          )}
        </View>
      )}
    </Pressable>
  );
};

export default CompanyCard;

/* -------------------------------------------------------------------------- */
/*  Usage                                                                     */
/* -------------------------------------------------------------------------- */
/*
import CompanyCard, { Company } from "./CompanyCard";

<FlatList
  data={companies}
  keyExtractor={(c) => c.co_id}
  contentContainerClassName="p-4 gap-4"
  renderItem={({ item }) => (
    <CompanyCard
      company={item}
      imageBaseUrl="https://your-domain.com/uploads/companies/"
      onPress={(c) => navigation.navigate("CompanyDetail", { id: c.co_id })}
    />
  )}
/>
*/
