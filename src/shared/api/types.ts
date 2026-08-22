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
  co_descp?: string;
  co_overview?: string;
  co_total_investment?: string;
  co_franchise_fee?: string;
  co_royalty_fee?: string;
  co_investment_range?: string;
  company_images?: CompanyImages[];
  company_poster?: string;
  co_video_url?: string;
  co_tag?: string;
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
  range?: number;
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
