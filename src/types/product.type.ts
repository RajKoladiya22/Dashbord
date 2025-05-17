export interface Product {
  id: string;
  image: string;
  productName: string;
  productCategory: Record<string, any>;
  productPrice: string;
  description?: string;
  productLink?: string;
  tags?: string[] | undefined;
  specifications?: Record<string, any>;
  admin_id: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data: {
    meta: { total: string; page: string; perPage: string; totalPages: string };
    product: Product | Product[];
  };
}

export interface ProductState {
  products: Product[];
  meta: Record<string, any>;
  loading: boolean;
  error: string | null;
}
