export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export type UserRole = 'investor' | 'brand';

export interface User {
  id: number;
  name: string;
  email: string;
  contact: string;
  company: string;
  image: string;
  city: string;
  date: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  pass: string;
}

export interface LoginResponse {
  token: string;
  user: ApiLoginUser;
}

/** Raw login payload as returned by the API (before mapping to User). */
export interface ApiLoginUser {
  user_id?: number;
  id?: number;
  firstname?: string;
  lastname?: string;
  name?: string;
  email: string;
  contact?: string;
  image?: string;
  date?: string;
  company?: string;
  city?: string;
  visibility?: string;
  orderno?: string;
}

export interface RegisterRequest {
  f_name: string;
  l_name: string;
  email: string;
  password: string;
  contact: string;
  company: string;
  city?: string;
  image?: string;
  orderno?: string;
}

export interface RegisterResponse {
  token: string;
  user: { id: number; name: string; email: string; contact: string; company: string };
}

export interface Category {
  c_id: string;
  c_name: string;
  c_slug: string;
  c_image: string;
  c_place_home: string;
}

export interface CompanyImages {
  fkco_id?: number;
  img_date?: string;
  img_id?: string;
  img_name?: string;
  slider_image_name?: string;
  img_time?: string;
  img_type?: string;
}

export interface FeaturedCompany {
  co_id: string;
  co_category_id: string;
  co_name: string;
  co_slug: string;
  company_images?: CompanyImages[];
  co_investment_range?: string;
  co_descp?: string;
  co_total_investment?: string;
  co_franchise_fee?: string;
  co_royalty_fee?: string;
  co_overview?: string;
}

export interface Company {
  co_id: string;
  co_category_id: string;
  co_name: string;
  co_slug: string;
  co_description?: string;
  co_overview?: string;
  co_total_investment?: string;
  co_franchise_fee?: string;
  co_royalty_fee?: string;
  co_investment_range?: string;
  company_images?: CompanyImages[];
  company_poster?: string;
  co_video_url?: string;
  co_website_url?: string;
  co_tag?: string;
  co_city?: string;
  [key: string]: any;
}

export interface Property {
  p_id: string;
  pName: string;
  pEmail?: string;
  pPhone?: string;
  pSize?: string;
  Pcity?: string;
  pFloor?: string;
  sAddress?: string;
  pMessage?: string;
  pCreatedDate?: string;
  pCreatedTime?: string;
  pUpdatedDate?: string;
  pUpdatedTime?: string;
  pimage?: string;
  pSlug?: string;
  pstatus?: string;
  is_featured?: string;
  uid?: string;
  [key: string]: any;
}

export interface Job {
  j_id: string;
  j_brandName: string;
  j_jobTitle: string;
  j_salary: string;
  j_qualification: string;
  j_keyResponsiblities: string;
  j_status: string;
  j_createDate: string;
  j_createTime: string;
  j_image_name: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  status: string;
  link: string;
  slug: string;
  date: string;
}

export interface Story {
  story_id: string;
  story_name: string;
  story_brand: string;
  story_city: string;
  story_desc: string;
  story_image: string;
  story_date: string;
  story_status: string;
}

export interface Event {
  [key: string]: any;
}

export interface Partner {
  id: string;
  partner_name: string;
  partner_logo: string;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  contact?: string;
}

export interface TeamEmployee {
  u_id: string;
  u_firstname?: string;
  u_lastname?: string;
  a_position?: string;
  u_email?: string;
  u_image?: string;
  u_contact?: string;
  u_bio?: string;
  u_city?: string;
}

export interface HomeData {
  counties: any[];
  seo: Record<string, any>;
  adverts: any[];
  center: any[];
  featured: Record<string, FeaturedCompany>;
  news: any[];
  articles: Article[];
  testimonials: any[];
  stories: Story[];
  categories: Category[];
  ranges: any[];
  cities: any[];
  property: Property[];
  franchisee: any[];
  franchiser: any[];
}

export interface InvestorFilterRequest {
  cat?: string;
  range?: string | number;
  city?: string;
}

export interface MoreInfoRequest {
  firstname: string;
  lastname: string;
  email: string;
  number: string;
  city: string;
  co_id: string;
  co_name?: string;
  message?: string;
  lead_type?: 'employee_contact' | 'investor' | 'ask-the-expert';
}

export interface City {
  id?: string | number;
  co_city?: string;
  name?: string;
}

// ─── Brand userpanel types ────────────────────────────────────────────────

/** Stats returned by GET /userpanel/dashboard (User_model->all_nums()). */
export interface BrandDashboardStats {
  companies?: number | string;
  leads?: number | string;
  investors?: number | string;
  jobs?: number | string;
  events?: number | string;
  properties?: number | string;
  news?: number | string;
  subscribers?: number | string;
  [key: string]: any;
}

/** An investor lead from GET /userpanel/company-leads/:co_id. */
export interface InvestorLead {
  id?: string | number;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  number?: string;
  phone?: string;
  city?: string;
  co_id?: string;
  co_name?: string;
  message?: string;
  lead_type?: string;
  created_at?: string;
  date?: string;
  e_firstname?: string;
  e_lastname?: string;
  e_email?: string;
  e_phonenumber?: string;
  e_message?: string;
  [key: string]: any;
}

/** A franchise request from GET /userpanel/franchise/requests. */
export interface FranchiseRequest {
  id?: string | number;
  name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  number?: string;
  city?: string;
  message?: string;
  created_at?: string;
  date?: string;
  [key: string]: any;
}

/** A contact message from GET /userpanel/contact. */
export interface ContactMessage {
  id?: string | number;
  name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  subject?: string;
  message?: string;
  created_at?: string;
  date?: string;
  [key: string]: any;
}

/** Dropdown data for the company create form. */
export interface CompanyCreateData {
  categories: Category[];
  cities: City[];
  countries: any[];
}

/** Form image asset for multipart uploads. */
export interface FormImage {
  uri: string;
  name: string;
  type: string;
}

/** Image slots on POST /userpanel/companies/create. */
export type CreateImageSlot = 'image_1' | 'image_2' | 'image_3' | 'image_4' | 'image_5';

/**
 * Image slots on POST /userpanel/companies/update/:id.
 *
 * Deliberately excludes `slider_image_1` / `slider_image_2`: the server reads
 * `id4` for `slider_image_1` as well as for `image_4`, so posting both in one
 * request writes the slider into image_4's row. No slider UI ships today.
 */
export type UpdateImageSlot = 'image_1' | 'image_2' | 'image_3' | 'image_4';

/** Any slot either endpoint accepts. Create has one more than update. */
export type CompanyImageSlot = CreateImageSlot | UpdateImageSlot;

export interface SlotValue {
  /** A newly picked local file, posted to replace this slot. */
  file?: FormImage | null;
  /**
   * `img_id` of the row this slot already owns, from the edit endpoint.
   * Empty => the server INSERTS a new images row instead of updating, which
   * is how duplicate rows accumulated on every save. Required for update.
   */
  id?: string | number | null;
}

/**
 * Payload for both company write endpoints.
 *
 * Create and update do NOT share field names — see `CreateCompanyFields` and
 * `UpdateCompanyFields` in the service for the per-endpoint shape.
 */
export interface CompanyPayload {
  /** Logged-in brand user id — create endpoint reads `huid`. */
  huid?: string;
  /** Logged-in brand user id — update (edit) endpoint reads `uid`. */
  uid?: string;
  name?: string;
  number?: string;
  url?: string;
  cash?: string;
  fee?: string;
  franchise_fee?: string;
  total_investment?: string;
  /**
   * The two endpoints read different spellings: create reads `royality_fee`,
   * update reads `royalty_fee`. Both are sent until the backend is
   * confirmed; an unread POST key is ignored, so this is safe.
   */
  royalty_fee?: string;
  royality_fee?: string;
  postal_address?: string;
  /** CREATE only — the update model reads `co_description`. */
  description?: string;
  /** UPDATE only. Server runs escape_str on every save, so never pre-escape. */
  co_description?: string;
  category?: string;
  city?: string;
  country?: string;
  /** Same one-key-ambiguity as royalty_fee; see the note there. */
  category_id?: string;
  city_id?: string;
  country_id?: string;
  province?: string;
  /** CREATE only — update regenerates the slug from `name`. */
  slug?: string;
  currencytype?: string;
  contact_person?: string;
  /** CREATE only — the update model's designation line is commented out. */
  designation?: string;
  email_address?: string;
  mobile_number?: string;
  /** Edit-only fields the `editpro` model reads. Ignored on create. */
  brand_slogan?: string;
  company_year?: string;
  franchise_years?: string;
  franchise_turnover?: string;
  average_turnover?: string;
  commision_type?: string;
  /** UPDATE only. The model reads this as `feature`; "1" marks it featured. */
  feature?: string;
  video_link?: string;
  home_page?: string;
  /** Targeted per-slot payloads, keyed by image slot. */
  images?: Partial<Record<CompanyImageSlot, SlotValue>>;
  [key: string]: any;
}

/** Brand owner's own profile (GET /userpanel/profile). */
export interface BrandProfile {
  id?: string | number;
  user_id?: string | number;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  contact?: string;
  company?: string;
  image?: string;
  city?: string;
  address?: string;
  pass?: string;
  [key: string]: any;
}
