import apiClient from './client';
import type { ApiResponse, Company, Category, Article, InvestorFilterRequest } from './types';

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
