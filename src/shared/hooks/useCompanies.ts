import { useQuery } from '@tanstack/react-query';
import * as companyService from '../api/companyService';
import type { InvestorFilterRequest } from '../api/types';
import { ALL_SECTORS, INTERNATIONAL_SLUG } from '../utils/franchise';

export function useCompanies(search?: string) {
  return useQuery({
    queryKey: ['companies', { search }],
    queryFn: () => companyService.getCompanies(search),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompanyDirectory(category: string) {
  return useQuery({
    queryKey: ['companies', 'directory', category],
    queryFn: () => {
      if (category === ALL_SECTORS) return companyService.getCompanies();
      if (category === INTERNATIONAL_SLUG) return companyService.getInternationalCompanies();
      return companyService.getCompaniesByCategory(category);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompany(slug: string) {
  return useQuery({
    queryKey: ['company', slug],
    queryFn: () => companyService.getCompany(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompaniesByCategory(slug: string) {
  return useQuery({
    queryKey: ['companies', 'category', slug],
    queryFn: () => companyService.getCompaniesByCategory(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInternationalCompanies() {
  return useQuery({
    queryKey: ['companies', 'international'],
    queryFn: companyService.getInternationalCompanies,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTop10Companies() {
  return useQuery({
    queryKey: ['companies', 'top10'],
    queryFn: companyService.getTop10Companies,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFilteredCompanies(params?: InvestorFilterRequest) {
  const hasFilter = Boolean(params && (params.cat || params.range || params.city));
  return useQuery({
    queryKey: ['companies', 'filter', params],
    queryFn: () => companyService.filterCompanies(params!),
    enabled: hasFilter,
    staleTime: 5 * 60 * 1000,
  });
}
