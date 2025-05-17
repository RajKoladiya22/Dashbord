import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import {
  Product,
  ProductResponse,
  ProductState,
} from "../../../types/product.type";

// 1) Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload: Partial<Product>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ProductResponse>(
        "/product",
        payload
      );
      return response.data.data.product;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// 2) Fetch all products
export const fetchAllProducts = createAsyncThunk<
  ProductResponse, // Return type: an array of team members.
  { status?: boolean; q?: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "products/fetchAllProducts",
  async ({ status, q, page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ProductResponse>("/product", {
        params: { status, q, page, limit },
      });
      // console.log("Product response--->", response);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// 3) Update a specific product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { id, data }: { id: string; data: Partial<Product> },
    { rejectWithValue }
  ) => {
    try {
      // console.log("ID-->",id);
      // console.log("data-->",data);

      const response = await axiosInstance.put<ProductResponse>(
        `/product/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// 4) Delete a specific product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      // console.log("ID-->",id);

      const response = await axiosInstance.delete<ProductResponse>(
        `/product/${id}`
      );
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// 5) Product Status
export const toggleProductStatus = createAsyncThunk<
  Product, // now returns one teamData
  { id: string | undefined; status: boolean },
  { rejectValue: string }
>("product/toggleStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{
      status: number;
      success: boolean;
      message: string;
      data: { product: Product };
    }>(`/product/status/${id}`, { status });
    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to update team status");
    }
    console.log("response.data.data.teamMembers-->", response);

    return response.data.data.product;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState: ProductState = {
  products: [],
  meta: { total: 0, page: 1, limit: 10, pages: 0 },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action: any) => {
      state.loading = false;
      state.products.push(action.payload);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAllProducts.fulfilled,
      (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false;
        state.products = Array.isArray(action.payload.data.product)
          ? action.payload.data.product
          : [action.payload.data.product];
        state.meta = action.payload.data.meta;
      }
    );
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action: any) => {
      state.loading = false;
      const updated = action.payload.data.product;
      state.products = state.products.map((prod) =>
        prod.id === updated.id ? updated : prod
      );
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteProduct.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.products = state.products.filter(
          (prod) => prod.id !== action.payload.id
        );
      }
    );
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // toggleProductStatus handlers
    builder.addCase(toggleProductStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(toggleProductStatus.fulfilled, (state, action: any) => {
      state.loading = false;
      state.products = state.products?.filter(
        (p: any) => p.id !== action.payload.id
      );
    });
    builder.addCase(toggleProductStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Could not toggle status";
    });
  },
});

export default productSlice.reducer;
