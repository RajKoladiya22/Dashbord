import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {PartnerData, PartnerResponse, PartnerState} from '../../APITypes'


const initialState: PartnerState = {
  Partner: null,
  loading: false,
  error: null,
};

// Async thunk to create a partner member
export const createPartner = createAsyncThunk(
  "partner/createPartner",
  async (PartnerData: PartnerData, { rejectWithValue }) => {
    try {
      const response = await axios.post<PartnerResponse>(
        "http://46.202.167.124/api/v1/auth/partner",
        // "http://localhost:3000/api/v1/auth/partner",
        PartnerData,
        {
          withCredentials: true, // important for cookie-based auth
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "Q0@gZ@dY7[jGQ/GRc@D9KSCX#U2Yz",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create partner member"
      );
    }
  }
);

export const resetStatus = () => {
  //
};

// Slice
const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    clearPartnerState: (state) => {
      state.Partner = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPartner.fulfilled,
        (state, action: PayloadAction<PartnerResponse>) => {
          state.loading = false;
          state.Partner = action.payload;
        }
      )
      .addCase(createPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPartnerState } = partnerSlice.actions;

export default partnerSlice.reducer;
