import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Partner,
  PartnerResponse,
  PartnerState,
} from "../../../types/partner.type";
import axiosInstance from "../../../utils/axiosInstance";

const initialState: PartnerState = {
  Partner: [],
  loading: false,
  error: null,
};

// Async thunk to create a partner member
export const createPartner = createAsyncThunk(
  "partner/createPartner",
  async (PartnerData: Partner, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<PartnerResponse>(
        "/auth/partner",
        PartnerData
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
      state.Partner = [];
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
        (
          state
          // action: PayloadAction<PartnerResponse>
        ) => {
          state.loading = false;
          // state.Partner = action.payload;
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
