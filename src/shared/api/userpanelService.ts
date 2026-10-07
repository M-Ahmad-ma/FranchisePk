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
  CreateImageSlot,
  UpdateImageSlot,
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

// ─── Multipart helpers ───────────────────────────────────────────────────

function appendText(fd: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  fd.append(key, String(value));
}

/** Post a real picked image as a file part. */
function appendFile(fd: FormData, field: string, file: { uri: string; name: string; type: string }) {
  fd.append(field, { uri: file.uri, name: file.name, type: file.type } as any);
}

// NOTE: unfilled image slots are deliberately NOT filled with a zero-byte part.
//
// It was tried and it broke the request outright — `ERR_NETWORK`, native detail
// "Unrecognized FormData part". Two independent reasons, both from RN's own
// FormData polyfill (Libraries/Network/FormData.js):
//
//   1. `append(key, value)` takes two arguments. The third (the filename) is
//      dropped on the floor.
//   2. A part is only a file if it is `{uri, name?, type?}` — a Blob has no
//      `uri`, so the native module has nothing to resolve and rejects it.
//
// The trick was only ever insurance against a PHP warning, not a fix for a
// fatal. The docs describe `$_FILES['image_2']['size'] > 0` with no isset()
// guard, but an undefined array key is an E_WARNING and `null > 0` is false,
// so the model just skips the slot. Confirmed empirically: a create request
// with no image parts at all still reached the contact insert and only failed
// on `con_p_name` being NULL, which is a genuine NOT NULL violation.

/** Slots on create — always inserts, no id fields. */
const CREATE_SLOTS: readonly CreateImageSlot[] = [
  'image_1', // logo    -> img_type=1
  'image_2', // gallery -> img_type=0
  'image_3',
  'image_4',
  'image_5',
];

/**
 * Slots on update, paired with the `id` field that targets an existing row.
 *   empty id  => INSERT a new images row
 *   filled id => UPDATE that img_id row in place
 */
const UPDATE_SLOTS: ReadonlyArray<{ slot: UpdateImageSlot; idField: string }> = [
  { slot: 'image_1', idField: 'id1' },
  { slot: 'image_2', idField: 'id2' },
  { slot: 'image_3', idField: 'id3' },
  { slot: 'image_4', idField: 'id4' },
];

/**
 * Thrown when the server answers 200 with `status: false`. The write endpoints
 * report failure in the body, not the status code, so without this check a
 * failed save looks identical to a successful one and the form navigates back.
 *
 * Never auto-retry this: a retry re-runs the image inserts and stacks
 * duplicate rows.
 */
export class CompanyWriteError extends Error {
  constructor(message: string, readonly httpStatus: number, readonly endpoint: string) {
    super(message);
    this.name = 'CompanyWriteError';
  }
}

function assertWriteOk(res: { data: ApiResponse<any> }, endpoint: string, httpStatus: number) {
  if (res.data?.status !== true) {
    throw new CompanyWriteError(
      res.data?.message ?? `Write failed (${httpStatus})`,
      httpStatus,
      endpoint,
    );
  }
  return res.data;
}

export async function createCompany(payload: CompanyPayload) {
  if (__DEV__) {
    console.log('[company:create] raw payload keys:', Object.keys(payload), 'huid:', payload.huid);
  }
  const formData = new FormData();
  const { images, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value == null || value === '') return;
    formData.append(key, String(value));
  });

  // Only slots with a real file get a part. See the note above appendFile.
  CREATE_SLOTS.forEach((slot) => {
    const file = images?.[slot]?.file;
    if (file) appendFile(formData, slot, file);
  });

  logFormData('company:create → POST /userpanel/companies/create', formData);

  const res = await apiClient.post<ApiResponse<{ company_id: number }>>(
    '/userpanel/companies/create',
    formData,
  );
  if (__DEV__) console.log('[company:create] response:', JSON.stringify(res.data));
  return assertWriteOk(res, 'companies/create', res.status);
}

/**
 * Edit-only fields that must be sent even when blanked, so clearing a value
 * in the form actually clears it server-side. Everything else stays
 * skip-empty (the edit GET does not return every column, so a blind empty
 * string could wipe a row the form never hydrated).
 */
const SEND_WHEN_EMPTY_ON_UPDATE = new Set([
  'brand_slogan',
  'company_year',
  'franchise_years',
  'franchise_turnover',
  'average_turnover',
  'commision_type',
  'feature',
  'video_link',
]);

export async function updateCompany(id: string | number, payload: CompanyPayload) {
  const endpoint = `userpanel/companies/update/${id}`;
  if (__DEV__) {
    console.log(`[company:update ${id}] raw payload keys:`, Object.keys(payload), 'uid:', payload.uid);
  }
  const formData = new FormData();
  const { images, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value == null) return;
    if (value === '' && !SEND_WHEN_EMPTY_ON_UPDATE.has(key)) return;
    formData.append(key, String(value));
  });

  // Always send the id field, even when blank: a blank id means INSERT, and
  // that is how every save used to stack a duplicate images row. A slot with
  // neither an id nor a file sends the id alone, which the server treats as
  // "nothing to change here".
  UPDATE_SLOTS.forEach(({ slot, idField }) => {
    const entry = images?.[slot];
    appendText(formData, idField, entry?.id ?? '');
    if (entry?.file) appendFile(formData, slot, entry.file);
  });

  if (__DEV__ && Object.values(payload.images ?? {}).some((v) => !v?.id)) {
    console.warn(
      `[company:update ${id}] at least one image slot has no img_id — that slot will INSERT a new ` +
      'images row. The edit endpoint must return img_id for updates to replace in place.',
    );
  }

  logFormData(`company:update → POST /userpanel/companies/update/${id}`, formData);

  const res = await apiClient.post<ApiResponse<boolean>>(`/userpanel/companies/update/${id}`, formData);
  if (__DEV__) console.log(`[company:update ${id}] response:`, JSON.stringify(res.data));
  return assertWriteOk(res, endpoint, res.status);
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
  const res = await apiClient.post<ApiResponse<boolean>>('/userpanel/profile/update', payload);
  return res.data;
}
