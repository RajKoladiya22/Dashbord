import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { Customer, ListCustomerResponse, CustomerResponse, ListParams, UpdateArgs, CustomerState } from "../../../types/customer.type";


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
      // console.log("Customer------->\n", response);
      return response.data.data.customer;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create customer"
      );
    }
  }
);

// 2) List Customers thunk
export const listCustomers = createAsyncThunk<
  { customers: Customer[]; meta: { total: number; page: number; limit: number; pages: number } },
  ListParams,
  { rejectValue: string }
>(
  "customers/listCustomers",
  async (params, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        q = '',
        status = true,
        sortBy = 'companyName',
        sortOrder = 'asc',
      } = params || {};

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        q,
        status: String(status),
        sortBy,
        sortOrder,
      });

      const response = await axiosInstance.get<ListCustomerResponse>(
        `/customer/list?${query.toString()}`
      );

      const { customers, meta } = response.data.data;
      return { customers, meta };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch customers"
      );
    }
  }
);

// 3) Update Customer thunk
export const updateCustomer = createAsyncThunk<
  Customer, // return type is a single customer
  UpdateArgs, // { id, data }
  { rejectValue: string }
>("customers/updateCustomer", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<CustomerResponse>(
      `/customer/update/${id}`,
      data
    );

    // console.log("CustomerState------>", response);
    console.log("response----customers------>", response.data.data.customer);

    

    // Cast the API’s array back to a single object
    const arr = response.data.data.customer;
    return Array.isArray(arr) ? arr[0] : (arr as Customer);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update customer"
    );
  }
});

// 4) Delete Customer thunk
export const deleteCustomer = createAsyncThunk<
  string, // return type: we can return a success message
  string, // arg type: customer id
  { rejectValue: string } // thunkAPI
>("customers/deleteCustomer", async (id: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/customer/delete/${id}`);
    console.log("Customer deleted: ", response.data.message);
    return response.data.data.customer.id; // assuming the API returns a success message
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete customer"
    );
  }
});

// 5) Customer Status Change thunk
export const toggleCustomerStatus = createAsyncThunk<
  Customer, // now returns one teamData
  { id: string | undefined; status: boolean },
  { rejectValue: string }
>("customers/toggleStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<CustomerResponse>(`/customer/status/${id}`, { status });
    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to update team status");
    }
    // console.log("Response-->", response);

    return response.data.data.customer;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState: CustomerState = {
  customers: [],
  meta: { total: 0, page: 1, limit: 10, pages: 0 },
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
      (state, action: PayloadAction<{ customers: Customer[]; meta: { total: number; page: number; limit: number; pages: number } }>) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.meta = action.payload.meta;
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
    builder.addCase(deleteCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteCustomer.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (c) => c.id !== action.payload
        );
      }
    );
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

        // toggleProductStatus handlers
        builder.addCase(toggleCustomerStatus.pending, (state) => {
          state.loading = true;
          state.error = null;
        });
        builder.addCase(toggleCustomerStatus.fulfilled, (state, action: any) => {
          state.loading = false;
          state.customers = state.customers?.filter(
            (p: any) => p.id !== action.payload.id
          );
        });
        builder.addCase(toggleCustomerStatus.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Could not toggle status";
        });
  },
});

export default customerSlice.reducer;
