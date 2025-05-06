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
      firstName: string;
      lastName: string;
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
  id?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
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
  firstName: string;
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
  teamMembers?: {
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

export interface UserProfile {
  id: string;
  role: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  partner_name?: string;
  contact_info?: string;
  plan_status?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
  };
  contact_number?: string;
  department?: string;
  position?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

export interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface Product {
  id: string;
  productName: string;
  productCategory: Record<string, any>;
  productPrice: string;
  description?: string;
  productLink?: string;
  tags?: string[];
  specifications?: Record<string, any>;
  admin_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    meta: { total: string; page: string; perPage: string; totalPages: string };
    product: Product | Product[];
  };
}

export interface SingleProductResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    product: Product;
  };
}

export interface MultipleProductsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    product: Product[];
  };
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}


// src/store/APITypes.ts

/**
 * The core Customer entity as returned by your API.
 */
export interface Customer {
  id: string;
  adminId: string;
  partnerId?: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  serialNo: string;
  prime: boolean;
  blacklisted: boolean;
  remark?: string;
  adminCustomFields: Record<string, any>[];
  address: Record<string, any>;
  joiningDate: string;              // ISO timestamp
  hasReference: boolean;
  createdAt: string;                // ISO timestamp
  updatedAt: string;                // ISO timestamp
  products: [];
}

/**
 * The shape of your slice’s state for customers.
 */
export interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

/**
 * The common API envelope when you return a single customer.
 */
export interface SingleCustomerResponse {
  data: {
    customers: Customer;
  };
  message?: string;
  status?: string;
}

/**
 * The common API envelope when you return a list of customers.
 */
export interface CustomerResponse {
  data: {
    customers: Customer[];  // always an array
  };
  message?: string;
  status?: string;
}
export interface CreaateCustomerResponse {
  data: {
    customer: Customer[];  // always an array
  };
  message?: string;
  status?: string;
}
