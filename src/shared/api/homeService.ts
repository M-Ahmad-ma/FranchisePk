import apiClient from './client';
import type { ApiResponse, HomeData } from './types';

export async function getHome() {
  const res = await apiClient.get<ApiResponse<HomeData>>('/home');
  return res.data.data;
}
