import apiClient from './client';
import type { ApiResponse, Property, Category } from './types';

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
