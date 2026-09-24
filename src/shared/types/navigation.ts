import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  InvestorDrawer: undefined;
  BrandDrawer: undefined;
};

export type AuthRole = 'investor' | 'brand';
export type AuthIntent = 'login' | 'signup';

export type AuthStackParamList = {
  Login: { role?: AuthRole } | undefined;
  Signup: { role?: AuthRole; intent?: AuthIntent } | undefined;
  ForgotPassword: undefined;
  InvestorGetStarted: undefined;
  BrandLogin: { role?: AuthRole } | undefined;
  BrandSignup: { role?: AuthRole } | undefined;
  BrandForgotPassword: undefined;
};

export type InvestorDrawerParamList = {
  MainTabs: NavigatorScreenParams<InvestorTabParamList>;
  Team: undefined;
  ContactUs: undefined;
  Partners: undefined;
  Vacancies: undefined;
};

export type InvestorTabParamList = {
  Home: undefined;
  FranchiseDirectory: NavigatorScreenParams<FranchiseStackParamList>;
  Properties: NavigatorScreenParams<PropertiesStackParamList>;
  ContactUs: undefined;
};

export type BrandDrawerParamList = {
  BrandTabs: NavigatorScreenParams<BrandTabParamList>;
  BrandLeads: BrandLeadsParams | undefined;
  BrandProfile: undefined;
  BrandContactUs: undefined;
};

export type BrandLeadsParams = {
  coId?: string;
  coName?: string;
  returnTo?: 'BrandDashboard' | 'BrandFranchises';
};

export type BrandTabParamList = {
  BrandDashboard: undefined;
  BrandLeads: BrandLeadsParams | undefined;
  BrandFranchises: NavigatorScreenParams<BrandFranchisesStackParamList>;
  BrandProfile: undefined;
};

export type BrandFranchisesStackParamList = {
  BrandCompaniesList: undefined;
  BrandCompanyForm: { id?: string } | undefined;
};

export type FranchiseStackParamList = {
  FranchiseList:
  | { filter?: string; cat?: string; range?: string | number; city?: string }
  | undefined;
  CompanyDetail: { slug: string };
};

export type PropertiesStackParamList = {
  PropertiesList: undefined;
  PropertyDetail: { id: string };
};
