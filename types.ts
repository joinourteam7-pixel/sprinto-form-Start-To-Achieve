
export enum UserRole {
  FREELANCER = 'فري لانسر',
  COMPANY = 'شركة',
  TRAINER = 'مدرب',
  STUDENT = 'طالب'
}

export interface FormData {
  nameArabic: string;
  nameEnglish: string;
  phonePrimary: string;
  phoneSecondary: string;
  role: UserRole;
  email?: string;
  trainingType?: string;
  companyName?: string;
  companyField?: string;
  customerCode?: string;
  timestamp?: string;
}

export interface RegistrationResponse {
  success: boolean;
  customerCode: string;
  message?: string;
}
