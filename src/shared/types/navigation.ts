import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  InvestorDrawer: undefined;
  BrandDrawer: undefined;
};

export type AuthRole = 'investor' | 'brand';

export type AuthStackParamList = {
  Login: { role?: AuthRole } | undefined;
  Signup: { role?: AuthRole } | undefined;
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
  Dashboard: undefined;
};

export type BrandDrawerParamList = {
  BrandTabs: NavigatorScreenParams<BrandTabParamList>;
  BrandLeads: undefined;
  BrandProfile: undefined;
  BrandContactUs: undefined;
};

export type BrandTabParamList = {
  BrandDashboard: undefined;
  BrandLeads: undefined;
  BrandFranchises: undefined;
  BrandProfile: undefined;
};

export type FranchiseStackParamList = {
  FranchiseList: { filter?: string } | undefined;
  CompanyDetail: { slug: string };
};

export type PropertiesStackParamList = {
  PropertiesList: undefined;
  PropertyDetail: { id: string };
};
