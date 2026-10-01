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

export async function getBrandCompanies(userId: number | string) {
  const res = await apiClient.get<ApiResponse<{ companies: Company[] }>>(
    `/userpanel/companies/${userId}`,
  );
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

/** Dev-only: dump FormData contents (fields + image parts) to the Metro console. */
function logFormData(tag: string, formData: FormData) {
  if (!__DEV__) return;
  const parts: Array<[string, unknown]> = (formData as any)._parts ?? [];
  const summary = parts.map(([key, value]) => {
    if (value != null && typeof value === 'object' && 'uri' in (value as any)) {
      const file = value as { uri?: string; name?: string; type?: string };
      return [key, { kind: 'file', uri: file.uri, name: file.name, type: file.type }];
    }
    return [key, { kind: 'text', value }];
  });
  console.log(`[${tag}] FormData → ${parts.length} part(s):`, JSON.stringify(summary, null, 2));
}

export async function createCompany(payload: CompanyPayload) {
  const formData = new FormData();
  const { images, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value == null || value === '') return;
    formData.append(key, String(value));
  });

  (images ?? []).forEach((image, index) => {
    formData.append(`image_${index + 1}`, {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any);
  });

  logFormData('company:create → POST /userpanel/companies/create', formData);

  const res = await apiClient.post<ApiResponse<boolean>>(
    '/userpanel/companies/create',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return res.data;
}

/**
 * Optional edit-only fields that must be sent even when blanked, so clearing
 * a value in the edit form actually clears it server-side. Everything else
 * stays skip-empty (the edit GET does not return every column, so a blind
 * empty string could wipe a row the form never hydrated).
 */
const SEND_WHEN_EMPTY_ON_UPDATE = new Set([
  'brand_slogan',
  'company_year',
  'franchise_years',
  'franchise_turnover',
  'average_turnover',
  'commision_type',
  'type_of_company',
  'video_link',
]);

export async function updateCompany(id: string | number, payload: CompanyPayload) {
  const formData = new FormData();
  const { images, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value == null) return;
    if (value === '' && !SEND_WHEN_EMPTY_ON_UPDATE.has(key)) return;
    formData.append(key, String(value));
  });

  (images ?? []).forEach((image, index) => {
    formData.append(`image_${index + 1}`, {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any);
  });

  logFormData(`company:update → POST /userpanel/companies/update/${id}`, formData);

  const res = await apiClient.post<ApiResponse<boolean>>(
    `/userpanel/companies/update/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return res.data;
}

// ─── Leads ───────────────────────────────────────────────────────────────

export async function getCompanyLeads(coId: string | number) {
  const res = await apiClient.get<ApiResponse<{ investrequests: InvestorLead[] } | InvestorLead[]>>(
    `/userpanel/company-leads/${coId}`,
  );
  const data = res.data.data;
  const investrequests = Array.isArray(data) ? data : (data?.investrequests ?? []);
  return { investrequests };
}

/** All investor leads across every company belonging to the logged-in user. */
export async function getUserLeads(userId: number | string) {
  const res = await apiClient.get<ApiResponse<{ investrequests: InvestorLead[] } | InvestorLead[]>>(
    `/userpanel/company-user-leads/${userId}`,
  );
  const data = res.data.data;
  const investrequests = Array.isArray(data) ? data : (data?.investrequests ?? []);
  return { investrequests };
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
