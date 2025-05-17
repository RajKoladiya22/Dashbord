import { Partner } from "./partner.type";

export interface User {
  id: string;
  role: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  partner?: Partner;
  contactInfo?: Record<string, any>;
  status?: boolean;
  address?: Record<string, any>;
  contactNumber?: string;
  department?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UserProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}


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
    user: User;
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