// src/redux/teamMemberSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PartnerData, PartnerState } from "../../types";
import axiosInstance from "../../../utils/axiosInstance";

const initialState: PartnerState = {
  Partner: null,
  loading: false,
  error: null,
};

// Async thunk to fetch team members.
export const fetchPartners = createAsyncThunk<
  PartnerData[], // Return type: an array of team members.
  void, // No argument passed.
  { rejectValue: string }
>("partner/fetchPartnerrs", async (_, { rejectWithValue }) => {
  try {
    // const response = await fetch("http://localhost:5000/api/partner/members", {
    //   method: "GET",
    //   redirect: "follow",
    // });

    const response = await axiosInstance.get<{
      status: number;
      success: boolean;
      message: string;
      data: { partners: PartnerData[] };
    }>("/partner/members");

    // console.log(response);

    // Check for HTTP errors.
    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to fetch team members");
    }

    // Parse the JSON response.

    return response.data.data.partners;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const PartnerMemberSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed.
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default PartnerMemberSlice.reducer;
