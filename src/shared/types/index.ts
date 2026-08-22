import React from 'react';
import type { ImageSourcePropType } from 'react-native';


export interface RelatedCompaniesCard {
  image: ImageSourcePropType;
  title: String;
  price: String;
}

export interface FranshiseFilterChip {
  id: string;
  label: string;
  icon?: React.ReactNode
}

export interface FeaturedCardProps {
  title?: string;
  description?: string;
  investmentRange?: string;
  tag?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
  onPressDetails?: () => void;
  containerClassName?: string;
  imageClassName?: string;
  tagContainerClassName?: string;
  tagTextClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  investmentClassName?: string;
  detailsButtonClassName?: string;
  detailsTextClassName?: string;
  buttonText?: string;
}

export interface PropertyDetails {
  type: string;
  size: string;
  yield: string;
}

export interface PropertyCardProps {
  id: number;
  tag: string;
  title: string;
  description: string;
  marketValue: string;
  details: PropertyDetails;
  imageUrl?: string;
  listedAt?: string;
  status?: string;
  city?: string;
  address?: string;
  floors?: string[];
  opportunity?: string;
}


export interface TeamCardProps {
  id?: number;
  image: ImageSourcePropType;
  name: string;
  role: string;
  containerClassName?: string;
  onContact?: () => void;
}

export interface Partner {
  id: number;
  name: string;
  logo: ImageSourcePropType;
  description: string;
}
