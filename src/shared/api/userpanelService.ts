import apiClient from './client';
import type {
  ApiResponse,
  LoginResponse,
  ApiLoginUser,
  BrandDashboardStats,
  InvestorLead,
  FranchiseRequest,
  ContactMessage,
  Company,
  CompanyCreateData,
  CompanyPayload,
  BrandProfile,
} from './types';

// ─── Auth ────────────────────────────────────────────────────────────────

export async function userpanelLogin(email: string, password: string) {
  const res = await apiClient.post<ApiResponse<LoginResponse>>(
    '/userpanel/auth/login',
    { email, password },
  );
  return res.data.data;
}

export async function userpanelLogout() {
  await apiClient.post<ApiResponse<boolean>>('/userpanel/auth/logout');
}

export async function userpanelMe() {
  const res = await apiClient.get<ApiResponse<ApiLoginUser>>('/userpanel/auth/me');
  return res.data.data;
}

// ─── Dashboard ───────────────────────────────────────────────────────────

export async function getBrandDashboard() {
  const res = await apiClient.get<ApiResponse<BrandDashboardStats>>('/userpanel/dashboard');
  return res.data.data;
}

// ─── Companies (brands) ──────────────────────────────────────────────────

export async function getBrandCompanies() {
  const res = await apiClient.get<ApiResponse<{ companies: Company[] }>>('/userpanel/companies');
  return res.data.data;
}

export async function getCompanyCreateData() {
  const res = await apiClient.get<ApiResponse<CompanyCreateData>>('/userpanel/companies/create-data');
  return res.data.data;
}

export async function getBrandCompany(id: string | number) {
  const res = await apiClient.get<ApiResponse<{ company: Company }>>(`/userpanel/companies/edit/${id}`);
  return res.data.data;
}

export async function createCompany(payload: CompanyPayload) {
  const res = await apiClient.post<ApiResponse<boolean>>('/userpanel/companies/create', payload);
  return res.data;
}

export async function updateCompany(id: string | number, payload: CompanyPayload) {
  const res = await apiClient.post<ApiResponse<boolean>>(
    `/userpanel/companies/update/${id}`,
    payload,
  );
  return res.data;
}

// ─── Leads ───────────────────────────────────────────────────────────────

export async function getInvestorRequests() {
  const res = await apiClient.get<ApiResponse<{ investrequests: InvestorLead[] }>>(
    '/userpanel/investor-requests',
  );
  return res.data.data;
}

export async function getFranchiseRequests() {
  const res = await apiClient.get<ApiResponse<{ requests: FranchiseRequest[] } | FranchiseRequest[]>>(
    '/userpanel/franchise/requests',
  );
  return res.data.data;
}

export async function getPropertyRequests() {
  const res = await apiClient.get<ApiResponse<{ requests: FranchiseRequest[] } | FranchiseRequest[]>>(
    '/userpanel/property/requests',
  );
  return res.data.data;
}

export async function getContactMessages() {
  const res = await apiClient.get<ApiResponse<{ contact: ContactMessage[] } | ContactMessage[]>>(
    '/userpanel/contact',
  );
  return res.data.data;
}

// ─── Profile ─────────────────────────────────────────────────────────────

export async function getBrandProfile() {
  const res = await apiClient.get<ApiResponse<BrandProfile>>('/userpanel/profile');
  return res.data.data;
}

export async function updateBrandProfile(payload: FormData) {
  const res = await apiClient.post<ApiResponse<boolean>>('/userpanel/profile/update', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
