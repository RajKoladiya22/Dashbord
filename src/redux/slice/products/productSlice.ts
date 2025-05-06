import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { Product, ProductState, ProductResponse } from "../../APITypes";

// Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload: Partial<Product>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ProductResponse>("/product", payload);
      return response.data.data.product;;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
  }
);

// Fetch all products for the authenticated admin
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ProductResponse>("/product");
      // console.log("Product response--->", response);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// Update a specific product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      // console.log("ID-->",id);
      // console.log("data-->",data);

      const response = await axiosInstance.put<ProductResponse>(`/product/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

// Delete a specific product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      // console.log("ID-->",id);
      
      const response = await axiosInstance.delete<ProductResponse>(`/product/${id}`);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

const initialState: ProductState = {
  products: [],
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
    builder.addCase(createProduct.fulfilled, (state, action:any) => {
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
    builder.addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
      state.loading = false;
      state.products = Array.isArray(action.payload.data.product)
        ? action.payload.data.product
        : [action.payload.data.product];
    });
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
      state.products = state.products.map((prod) => (prod.id === updated.id ? updated : prod));
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
    builder.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.products = state.products.filter((prod) => prod.id !== action.payload.id);
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default productSlice.reducer;
