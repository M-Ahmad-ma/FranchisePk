import apiClient from './client';
import type { ApiResponse, Property, Category } from './types';

export interface AddPropertyFields {
  propertyName: string;
  email: string;
  phone: string;
  city: string;
  size: string;
  floor: string;
  s_address: string;
  m_message: string;
}

export interface AddPropertyImage {
  uri: string;
  name: string;
  type: string;
}

export async function addProperty(fields: AddPropertyFields, image?: AddPropertyImage) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (image) {
    formData.append('image_1', {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any);
  }
  const res = await apiClient.post<ApiResponse<boolean>>('/properties/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function getProperties() {
  const res = await apiClient.get<ApiResponse<{
    categories: Category[];
    property: Property[];
  }>>('/properties');
  return res.data.data;
}

export async function getProperty(id: string) {
  const res = await apiClient.get<ApiResponse<{
    ranges: any[];
    categories: Category[];
    property: Property;
    city: any[];
  }>>(`/properties/${id}`);
  return res.data.data;
}
