// // src/redux/teamMemberSlice.ts
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { PartnerData, PartnerState } from "../../APITypes";
// import axiosInstance from "../../../utils/axiosInstance";

// const initialState: PartnerState = {
//   Partner: null,
//   loading: false,
//   error: null,
// };

// // Async thunk to fetch team members.
// export const fetchPartners = createAsyncThunk<
//   PartnerData[], // Return type: an array of team members.
//   void, // No argument passed.
//   { rejectValue: string }
// >("partner/fetchPartnerrs", async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get<{
//       status: number;
//       success: boolean;
//       message: string;
//       data: { partners: PartnerData[] };
//     }>("/partner");

//     // console.log("PartnerData---->\n",response);

//     // Check for HTTP errors.
//     if (response.status !== 200 || !response.data.success) {
//       throw new Error("Failed to fetch Partner");
//     }

//     // Parse the JSON response.

//     return response.data.data.partners;
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });

// export const togglePartnerStatus = createAsyncThunk<
//   { id: string | undefined; status: boolean },
//   { id: string | undefined; status: boolean },
//   { rejectValue: string }
// >("partner/toggleStatus", async ({ id, status }, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.patch(`/partner/${id}/status`, {
//       status,
//     });
//     if (response.status !== 200 || !response.data.success) {
//       throw new Error("Failed to fetch Partner");
//     }

//     // Parse the JSON response.
//     fetchPartners()
//     return response.data.data.partners;
//   } catch (err: any) {
//     return rejectWithValue(
//       err.response?.data?.message || "Failed to change status"
//     );
//   }
// });

// const PartnerMemberSlice = createSlice({
//   name: "partners",
//   initialState,
//   reducers: {
//     // You can add synchronous reducers here if needed.
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPartners.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPartners.fulfilled, (state, action) => {
//         state.loading = false;
//         state.Partner = action.payload;
//       })
//       .addCase(fetchPartners.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(togglePartnerStatus.pending, (state) => {
//         // optimistic update: flip status in local list
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(togglePartnerStatus.fulfilled, (state) => {
//         state.loading = false;
//         // state.Partner = action.payload;
//       })
//       .addCase(togglePartnerStatus.rejected, (state, action) => {
//         // rollback on error
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default PartnerMemberSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PartnerData, PartnerState } from "../../APITypes";
import axiosInstance from "../../../utils/axiosInstance";

const initialState: PartnerState = {
  Partner: [],
  loading: false,
  error: null,
};

// 1️⃣ Fetch all partners
export const fetchPartners = createAsyncThunk<
  PartnerData[],
  { status?: boolean },
  { rejectValue: string }
>("partner/fetchPartners", async ({ status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{
      status: number;
      success: boolean;
      message: string;
      data: { partners: PartnerData[] };
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
  PartnerData, // now returns one PartnerData
  { id: string | undefined; status: boolean },
  { rejectValue: string }
>("partner/toggleStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{
      status: number;
      success: boolean;
      message: string;
      data: { partners: PartnerData };
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
