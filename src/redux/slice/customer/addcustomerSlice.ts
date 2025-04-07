import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Customer {
  adminId: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  tallySerialNo: string;
  prime: boolean;
  blacklisted: boolean;
  remark: string;
  hasPartnerReference: boolean;
  PartnerReferenceDetail?: {
    referenceId: string;
    Name: string;
    // add additional fields if needed
  } | null;
  // You can add other fields like products, adminCustomFields, createdAt, updatedAt etc.
}

interface CustomerState {
  data: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to post customer data
export const postCustomer = createAsyncThunk(
  'customer/postCustomer',
  async (customer: Customer, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/add-customer', customer);
      // Assuming the API returns the saved customer data.
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred while saving customer data');
    }
  }
);

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // You can add synchronous actions here if needed.
  },
  extraReducers: (builder) => {
    builder
      .addCase(postCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        // Append the newly saved customer data to our state
        state.data.push(action.payload);
      })
      .addCase(postCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerSlice.reducer;
