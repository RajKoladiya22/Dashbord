export interface Partner {
  id?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  status?: boolean;
  partner_type?: string;
  role?: string;
  contactInfo?: Record<string, any> | undefined;
  address?: any;
  createdAt?: Date;
  updatedAt?: string;
}

export interface PartnerResponse {
  status: number;
  success: boolean;
  message: string;
  Partner: Partner;
}

// PartnerState
export interface PartnerState {
  // Partner: PartnerResponse | Partner[] | null;
  Partner: Partner[]; 
  loading: boolean;
  error: string | null;
}