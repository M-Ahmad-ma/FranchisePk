import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  InvestorDrawer: undefined;
};

export type AuthRole = 'investor' | 'brand';

export type AuthStackParamList = {
  Onboarding: undefined;
  RoleSelection: undefined;
  Login: { role?: AuthRole } | undefined;
  Signup: { role?: AuthRole } | undefined;
  ForgotPassword: undefined;
};

export type InvestorDrawerParamList = {
  MainTabs: NavigatorScreenParams<InvestorTabParamList>;
  ContactUs: undefined;
  Partners: undefined;
  Vacancies: undefined;
  Profile: undefined;
};

export type InvestorTabParamList = {
  Home: undefined;
  FranchiseDirectory: NavigatorScreenParams<FranchiseStackParamList>;
  Properties: NavigatorScreenParams<PropertiesStackParamList>;
  Dashboard: undefined;
  Profile: undefined;
};

export type FranchiseStackParamList = {
  FranchiseList: { filter?: string } | undefined;
  CompanyDetail: { slug: string };
};

export type PropertiesStackParamList = {
  PropertiesList: undefined;
  PropertyDetail: { id: string };
};
