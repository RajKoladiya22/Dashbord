// src/store/slices/customerSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { Customer, CustomerState, CustomerResponse } from "../../APITypes";

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
  },
});

export default customerSlice.reducer;
