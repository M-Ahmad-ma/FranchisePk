import React from 'react';
import { View, Text, Image } from 'react-native';

interface FinancialStatsCardProps {
  totalInvestment: string;
  franchiseFee: string;
  royaltyFee: string;
  containerClassName?: string;
  icon?: React.ReactNode;         // single icon for all rows
  icons?: [React.ReactNode, React.ReactNode, React.ReactNode]; // optional per-row icons
  sectionImages?: [string?, string?, string?]; // optional per-row thumbnails
}

const FinancialStatsCard: React.FC<FinancialStatsCardProps> = ({
  totalInvestment,
  franchiseFee,
  royaltyFee,
  containerClassName = '',
  icon,
  icons,
  sectionImages,
}) => {
  const stats = [
    { label: 'TOTAL INVESTMENT', value: totalInvestment },
    { label: 'FRANCHISE FEE', value: franchiseFee },
    { label: 'ROYALTY FEE', value: royaltyFee },
  ];

  return (
    <View className={`p-4 shadow-sm ${containerClassName}`} >
      {stats.map((stat, index) => (
        <View
          key={index}
          className="rounded-lg mb-2 border-neutral-300 border-[0.9px] p-4"
        >
          <View className="flex flex-row items-center gap-3">
            {sectionImages?.[index] && (
              <Image
                source={{ uri: sectionImages[index] }}
                className="w-12 h-12 rounded-lg"
                resizeMode="cover"
              />
            )}
            <Text className="text-xl text-neutral-700 font-lato uppercase tracking-wide">
              {stat.label}
            </Text>
          </View>
          <View className="flex flex-row items-end justify-between">
            <Text className="text-base font-lato text-primary-900 mt-9">
              {stat.value}
            </Text>
            {icons?.[index] ?? icon ?? null}
          </View>
        </View>
      ))}
    </View>
  );
};

export default FinancialStatsCard;
