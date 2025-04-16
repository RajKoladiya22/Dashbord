//signIn Credentials
export interface LoginCredentials {
  identifier: string; // Can be email or username.
  password: string;
}

//signIN Response
export interface AuthResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      username: string;
      role: string;
      // add other user properties if needed
    };
  };
}

// Auth State
export interface AuthState {
  currentUser: AuthResponse | null;
  loading: boolean;
  error: string | null;
}

//signIn Credentials
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactNumber: string;
  companyName: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
  };
  planStatus?: string; // e.g., 'active', 'inactive', 'free trial'
  role?: string; // e.g., 'admin'
}

// Partner Data
export interface PartnerData {
  partner_name?: string;
  company_name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  partner_type?: string;
  contact_info?: {} | null;
}

//partner signIN Response
export interface PartnerResponse {
  status: number;
  success: boolean;
  message: string;
  Partner: {
    id: string;
    partner_name: string;
    company_name: string;
    email: string;
    contact_info: {} | null;
    status: string;
  };
}

// PartnerState
export interface PartnerState {
  Partner: PartnerResponse | PartnerData[] | null;
  loading: boolean;
  error: string | null;
}

// TeamMember Data
export interface TeamMemberData {
  full_name: string;
  email: string;
  contactNumber?: string;
  password: string;
  department?: string;
  position?: string;
  role?: string;
}

// TeamMember signUp Response
export interface TeamMembersignUpResponse {
  status?: number;
  success?: boolean;
  message: string;
  teamMember?: {
    id: string;
    full_name: string;
    email: string;
    department: string;
    position: string;
    admin_id: string;
    role: string;
  };
}

// TeamState
export interface TeamState {
  teamMember?: TeamMembersignUpResponse | TeamMemberData[] | null | [];
  loading?: boolean;
  error?: string | null;
}

// TeamMember List Response
export interface TeamMemberListResponse {
  status?: number;
  success?: boolean;
  message?: string;
  teamMember?: {
    id: string;
    full_name?: string;
    email?: string;
    department?: string;
    position?: string;
    admin_id?: string;
    role?: string;
  };
}
