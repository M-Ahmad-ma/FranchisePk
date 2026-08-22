import apiClient from './client';
import type { ApiResponse, Company, Category, Article, InvestorFilterRequest, MoreInfoRequest, City } from './types';

export async function getCompanies(search?: string) {
  const res = await apiClient.get<ApiResponse<{
    categories: Category[];
    ranges: any[];
    cities: any[];
    companies: Company[];
  }>>('/companies', { params: search ? { q: search } : {} });
  return res.data.data;
}

export async function getCompany(slug: string) {
  const res = await apiClient.get<ApiResponse<{
    company: Company;
    related: Company[];
    companyEmp: any[];
    city: any[];
    categories: Category[];
  }>>(`/companies/${slug}`);
  return res.data.data;
}

export async function getCompaniesByCategory(slug: string) {
  const res = await apiClient.get<ApiResponse<{
    ranges: any[];
    categories: Category[];
    cities: any[];
    company_name: string;
    companies: Company[] | Record<string, Company>;
    news: Article[];
  }>>(`/companies/category/${slug}`);
  const data = res.data.data;
  const companies = Array.isArray(data.companies)
    ? data.companies
    : Object.values(data.companies ?? {});
  return { ...data, companies };
}

export async function getInternationalCompanies() {
  const res = await apiClient.get<ApiResponse<{
    ranges: any[];
    categories: Category[];
    cities: any[];
    companies: Company[];
  }>>('/companies/international');
  return res.data.data;
}

export async function getTop10Companies() {
  const res = await apiClient.get<ApiResponse<{
    categories: Category[];
    companies: Company[];
  }>>('/companies/top10');
  return res.data.data;
}

export async function filterCompanies(params: InvestorFilterRequest) {
  const res = await apiClient.post<ApiResponse<{
    heading: string;
    categories: Category[];
    companies: Company[];
  }>>('/companies/filter', params);
  return res.data.data;
}

export async function getCities() {
  const res = await apiClient.get<ApiResponse<{ cities: City[] }>>('/cities');
  return res.data.data;
}

export async function submitMoreInfo(slug: string, payload: MoreInfoRequest) {
  console.log('[MoreInfo][DEBUG] →', `POST /company/more-info/${slug}`, JSON.stringify(payload));
  try {
    const res = await apiClient.post<ApiResponse<boolean>>(`/company/more-info/${slug}`, payload);
    console.log('[MoreInfo][DEBUG] ← ok', res.status, JSON.stringify(res.data));
    return res.data;
  } catch (e: any) {
    console.log('[MoreInfo][DEBUG] ← error', {
      status: e?.response?.status,
      statusText: e?.response?.statusText,
      data: e?.response?.data,
      message: e?.message,
    });
    throw e;
  }
}

/**
 * Map a submitMoreInfo failure to a user-friendly message.
 * The API returns 500 + an HTML page (not the documented 409 JSON) when the
 * same email is submitted twice for the same brand, so we sniff the body.
 */
export function getMoreInfoErrorMessage(e: any): string {
  const data = e?.response?.data;
  const status = e?.response?.status;
  if (typeof data === 'string' && /Duplicate entry/i.test(data)) {
    return 'You have already requested this brand.';
  }
  return (
    data?.message ||
    (status === 409 ? 'You have already requested this brand.' : 'Something went wrong. Please try again.')
  );
}
