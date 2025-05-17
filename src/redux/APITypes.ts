//signIn Credentials

import { Partner } from "../types/partner.type";


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

// Partner Data
// export interface PartnerData {
//   id?: string;
//   firstName?: string;
//   lastName?: string;
//   companyName?: string;
//   email?: string;
//   password?: string;
//   confirmPassword?: string;
//   status?: boolean;
//   partner_type?: string;
//   role?: string;
//   contactInfo?: Record<string, any> | undefined;
//   address?: any;
//   createdAt?: Date;
  
// }

// //partner signIN Response
// export interface PartnerResponse {
//   status: number;
//   success: boolean;
//   message: string;
//   Partner: PartnerData;
// }

// // PartnerState
// export interface PartnerState {
//   // Partner: PartnerResponse | PartnerData[] | null;
//   Partner: PartnerData[]; 
//   loading: boolean;
//   error: string | null;
// }

// // TeamMember Data
// export interface TeamMemberData {
//   id?:string;
//   firstName: string;
//   lastName?: string;
//   email: string;
//   contactNumber?: string;
//   password: string;
//   department?: string;
//   position?: string;
//   role?: string;
//   status?:boolean;
//   createdAt?:Date;
//   address?:any;
// }

// // TeamMember signUp Response
// export interface TeamMembersignUpResponse {
//   status?: number;
//   success?: boolean;
//   message: string;
//   teamMembers?: {
//     id: string;
//     full_name: string;
//     email: string;
//     department: string;
//     position: string;
//     admin_id: string;
//     role: string;
//   };
// }

// // TeamState
// export interface TeamState {
//   teamMember?: TeamMemberData[];
//   loading?: boolean;
//   error?: string | null;
// }

// // TeamMember List Response
// export interface TeamMemberListResponse {
//   status?: number;
//   success?: boolean;
//   message?: string;
//   teamMember?: {
//     id: string;
//     full_name?: string;
//     email?: string;
//     department?: string;
//     position?: string;
//     admin_id?: string;
//     role?: string;
//   };
// }


// export interface Product {
//   id: string;
//   image: string;
//   productName: string;
//   productCategory: Record<string, any>;
//   productPrice: string;
//   description?: string;
//   productLink?: string;
//   tags?:string[] | undefined;
//   specifications?: Record<string, any>;
//   admin_id: string;
//   status?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }


// export interface ProductResponse {
//   status: number;
//   success: boolean;
//   message: string;
//   data: {
//     meta: { total: string; page: string; perPage: string; totalPages: string };
//     product: Product | Product[];
//   };
// }

// export interface SingleProductResponse {
//   status: number;
//   success: boolean;
//   message: string;
//   data: {
//     product: Product;
//   };
// }

// export interface MultipleProductsResponse {
//   status: number;
//   success: boolean;
//   message: string;
//   data: {
//     product: Product[];
//   };
// }

// export interface ProductState {
//   products: Product[];
//   loading: boolean;
//   error: string | null;
// }


// // src/store/APITypes.ts

// /**
//  * The core Customer entity as returned by your API.
//  */
// export interface Customer {
//   id: string;
//   adminId: string;
//   partnerId?: string;
//   companyName: string;
//   contactPerson: string;
//   mobileNumber: string;
//   email: string;
//   serialNo: string;
//   prime: boolean;
//   blacklisted: boolean;
//   remark?: string;
//   adminCustomFields: Record<string, any>[];
//   address: Record<string, any>;
//   joiningDate: string;              // ISO timestamp
//   hasReference: boolean;
//   products: Product;
//   createdAt: string;                // ISO timestamp
//   updatedAt: string;
//   partner: PartnerData;                // ISO timestamp
// }

// /**
//  * The shape of your slice’s state for customers.
//  */
// export interface CustomerState {
//   customers: Customer[];
//   meta: Record<string, any>;
//   loading: boolean;
//   error: string | null;
// }

// /**
//  * The common API envelope when you return a single customer.
//  */
// export interface SingleCustomerResponse {
//   data: {
//     customers: Customer;
//   };
//   message?: string;
//   status?: string;
// }

// /**
//  * The common API envelope when you return a list of customers.
//  */
// export interface CustomerResponse {
//   message?: string;
//   status?: string;

//   data: {
//     customers: Customer[];  // always an array
//     meta: any;
//   };
// }
// export interface CreaateCustomerResponse {
//   data: {
//     customer: Customer[];  // always an array
//   };
//   message?: string;
//   status?: string;
// }


// export interface ReminderData {
//   id: string;
//   expiryDate: string;
//   renewalDate: string | null;
//   purchaseDate: string;
//   productPrice: string;
//   renewal: boolean;
//   status: boolean;
//   product: Product;
//   customer: Customer;
//   createdAt: string;
// }