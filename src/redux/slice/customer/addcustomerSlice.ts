// src/store/slices/customerSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { Customer, CustomerState, CustomerResponse } from "../../APITypes";

interface UpdateArgs {
  id: string;
  data: Partial<Customer>;
}

// 1) Create Customer thunk
export const createCustomer = createAsyncThunk<
  Customer, // return type
  Partial<Customer>, // arg type
  { rejectValue: string } // thunkAPI
>(
  "customers/createCustomer",
  async (payload: Partial<Customer>, { rejectWithValue }) => {
    try {
      const response: any = await axiosInstance.post<CustomerResponse>(
        "/customer/add",
        payload
      );
      console.log("Customer------->\n", response);
      return response.data.data.customers;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create customer"
      );
    }
  }
);

// 2) List Customers thunk
export const listCustomers = createAsyncThunk<
  Customer[], // return type
  void, // no arg
  { rejectValue: string } // thunkAPI
>("customers/listCustomers", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CustomerResponse>(
      "/customer/list"
    );
    // ensure array
    const cust = response.data.data.customers;
    // console.log("Customer------->\n", cust);

    return Array.isArray(cust) ? cust : [cust];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch customers"
    );
  }
});

// 3) Update Customer thunk
export const updateCustomer = createAsyncThunk<
  Customer,         // return type is a single customer
  UpdateArgs,       // { id, data }
  { rejectValue: string }
>(
  "customers/updateCustomer",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<CustomerResponse>(
        `/customer/update/${id}`,
        data
      );
      // Cast the API’s array back to a single object
      const arr = response.data.data.customers;
      return Array.isArray(arr) ? arr[0] : arr as Customer;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update customer"
      );
    }
  }
);

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // createCustomer
    builder.addCase(createCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createCustomer.fulfilled,
      (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.customers.push(action.payload);
      }
    );
    builder.addCase(createCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // listCustomers
    builder.addCase(listCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      listCustomers.fulfilled,
      (state, action: PayloadAction<Customer[]>) => {
        state.loading = false;
        state.customers = action.payload;
      }
    );
    builder.addCase(listCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // updateCustomer
    builder.addCase(updateCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateCustomer.fulfilled,
      (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        const updated = action.payload;
        state.customers = state.customers.map((c) =>
          c.id === updated.id ? updated : c
        );
      }
    );
    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default customerSlice.reducer;
