import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TeamMember, TeamState } from "../../../types/team.type";
import axiosInstance from "../../../utils/axiosInstance";

const initialState: TeamState = {
  teamMember: [],
  loading: false,
  error: null,
};

// Async thunk to fetch team members.
export const fetchTeamMembers = createAsyncThunk<
  TeamMember[], // Return type: an array of team members.
  { status?: boolean },
  { rejectValue: string }
>("team/fetchMembers", async ({ status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{
      status: number;
      success: boolean;
      message: string;
      data: { teamMembers: TeamMember[] };
    }>("/team-members", {
      params: { status }, // ← HERE
    });
    // console.log(response);

    // Check for HTTP errors.
    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to fetch team members");
    }
    // Parse the JSON response.
    return response.data.data.teamMembers;
  } catch (error: any) {
    // console.log("ERROR--->", error);

    return rejectWithValue(error.message || error.response.data.message);
  }
});

export const toggleTeamStatus = createAsyncThunk<
  TeamMember, // now returns one teamData
  { id: string | undefined; status: boolean },
  { rejectValue: string }
>("team/toggleStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{
      status: number;
      success: boolean;
      message: string;
      data: { teamMembers: TeamMember };
    }>(`/team-members/${id}/status`, { status });
    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to update team status");
    }
    console.log("response.data.data.teamMembers-->", response);

    return response.data.data.teamMembers;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const teamMemberSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed.
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state: TeamState, action) => {
        state.loading = false;
        state.teamMember = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // toggleTeamStatus handlers
      .addCase(toggleTeamStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTeamStatus.fulfilled, (state, action: any) => {
        state.loading = false;
        state.teamMember = state.teamMember?.filter(
          (p: any) => p.id !== action.payload.id
        );
      })
      .addCase(toggleTeamStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not toggle status";
      });
  },
});

export default teamMemberSlice.reducer;
