import { Partner } from "./partner.type";
import { Product } from "./product.type";

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
  status: boolean;
  adminCustomFields: Record<string, any>[];
  address: Record<string, any>;
  joiningDate: string;
  hasReference: boolean;
  product?: Product | Product[];
  partner?: Partner;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerState {
  customers: Customer[];
  meta: Record<string, any>;
  loading: boolean;
  error: string | null;
}

export interface CustomerResponse {
  data: {
    customer: Customer;
  };
  status?: number;
  success?: boolean;
  message?: string;
}

export interface ListCustomerResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data: {
    customers: Customer[];
    meta: any;
  };
}

export interface UpdateArgs {
  id: string;
  data: Partial<Customer>;
}

export interface ListParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}


export interface ReminderData {
  id: string;
  expiryDate: string;
  renewalDate: string | null;
  purchaseDate: string;
  productPrice: string;
  renewal: boolean;
  status: boolean;
  product: Product;
  customer: Customer;
  createdAt: string;
}