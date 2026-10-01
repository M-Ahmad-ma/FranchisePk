import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as userpanel from '../api/userpanelService';
import type { CompanyPayload, InvestorLead } from '../api/types';
import { useAuth } from '../auth/AuthContext';

export function useBrandDashboard() {
  return useQuery({
    queryKey: ['userpanel', 'dashboard'],
    queryFn: userpanel.getBrandDashboard,
    staleTime: 60 * 1000,
  });
}

export function useBrandCompanies() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ['userpanel', 'companies', userId],
    queryFn: () => userpanel.getBrandCompanies(userId!),
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
}

export function useCompanyCreateData(enabled = true) {
  return useQuery({
    queryKey: ['userpanel', 'companies', 'create-data'],
    queryFn: userpanel.getCompanyCreateData,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBrandCompany(id: string | number | undefined) {
  return useQuery({
    queryKey: ['userpanel', 'company', id],
    queryFn: () => userpanel.getBrandCompany(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompanyPayload) => userpanel.createCompany(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['userpanel', 'companies'] });
      qc.invalidateQueries({ queryKey: ['userpanel', 'dashboard'] });
    },
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: CompanyPayload }) =>
      userpanel.updateCompany(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['userpanel', 'companies'] });
      qc.invalidateQueries({ queryKey: ['userpanel', 'company'] });
    },
  });
}

export function useCompanyLeads(coId: string | number | undefined) {
  return useQuery({
    queryKey: ['userpanel', 'leads', 'investor', 'company', coId],
    enabled: coId != null && coId !== '',
    queryFn: () => userpanel.getCompanyLeads(coId!),
    staleTime: 30 * 1000,
  });
}

export function useUserLeads(enabled = true) {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ['userpanel', 'leads', 'investor', 'user', userId],
    enabled: enabled && !!userId,
    queryFn: () => userpanel.getUserLeads(userId!),
    staleTime: 30 * 1000,
  });
}

/** @deprecated Use useUserLeads — kept for compatibility; now backed by company-user-leads. */
export function useInvestorRequests() {
  return useUserLeads();
}

export function useFranchiseRequests() {
  return useQuery({
    queryKey: ['userpanel', 'leads', 'franchise'],
    queryFn: userpanel.getFranchiseRequests,
    staleTime: 30 * 1000,
  });
}

export function usePropertyRequests() {
  return useQuery({
    queryKey: ['userpanel', 'leads', 'property'],
    queryFn: userpanel.getPropertyRequests,
    staleTime: 30 * 1000,
  });
}

export function useContactMessages() {
  return useQuery({
    queryKey: ['userpanel', 'leads', 'contact'],
    queryFn: userpanel.getContactMessages,
    staleTime: 30 * 1000,
  });
}

export function useBrandProfile() {
  return useQuery({
    queryKey: ['userpanel', 'profile'],
    queryFn: userpanel.getBrandProfile,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateBrandProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => userpanel.updateBrandProfile(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['userpanel', 'profile'] });
    },
  });
}
