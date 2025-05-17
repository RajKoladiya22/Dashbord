import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { Partner, PartnerState } from "../../../types/partner.type";

const initialState: PartnerState = {
  Partner: [],
  loading: false,
  error: null,
};

// 1️⃣ Fetch all partners
export const fetchPartners = createAsyncThunk<
  Partner[],
  { status?: boolean },
  { rejectValue: string }
>("partner/fetchPartners", async ({ status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{
      status: number;
      success: boolean;
      message: string;
      data: { partners: Partner[] };
    }>("/partner", {
      params: { status }, // ← HERE
    });
    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to fetch partners");
    }
    return response.data.data.partners;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// 2️⃣ Toggle a single partner’s status
export const togglePartnerStatus = createAsyncThunk<
  Partner, // now returns one Partner
  { id: string | undefined; status: boolean },
  { rejectValue: string }
>("partner/toggleStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{
      status: number;
      success: boolean;
      message: string;
      data: { partners: Partner };
    }>(`/partner/${id}/status`, { status });
    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to update partner status");
    }
    return response.data.data.partners;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const partnerSlice = createSlice({
  name: "partnerMember",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPartners handlers
      .addCase(fetchPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.Partner = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // togglePartnerStatus handlers
      .addCase(togglePartnerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePartnerStatus.fulfilled, (state, action) => {
        state.loading = false;
        // 3️⃣ Optimistically update the matching partner’s status
        state.Partner = state.Partner.filter((p) => p.id !== action.payload.id);
      })
      .addCase(togglePartnerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not toggle status";
      });
  },
});

export default partnerSlice.reducer;
