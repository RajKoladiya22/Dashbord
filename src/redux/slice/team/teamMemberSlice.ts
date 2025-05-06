// src/redux/teamMemberSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TeamMemberData,
  //  TeamMemberListResponse,
    TeamState } from "../../APITypes";
import axiosInstance from "../../../utils/axiosInstance";

const initialState: TeamState = {
  teamMember: null,
  loading: false,
  error: null,
};

// Async thunk to fetch team members.
export const fetchTeamMembers = createAsyncThunk<
  TeamMemberData[], // Return type: an array of team members.
  void, // No argument passed.
  { rejectValue: string }
>("team/fetchMembers", async (_, { rejectWithValue }) => {
  try {
    // const response = await fetch("http://localhost:5000/api/team/members", {
    //   method: "GET",
    //   redirect: "follow",
    // });
    const response = await axiosInstance.get<{
      status: number;
      success: boolean;
      message: string;
      data: { teamMembers: TeamMemberData[] };
    }>('/team-members');
    // console.log(response);
    
    
    // Check for HTTP errors.
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Failed to fetch team members');
    }
    // Parse the JSON response.
    return response.data.data.teamMembers;
  } catch (error: any) {
    // console.log("ERROR--->", error);
    
    return rejectWithValue(error.message || error.response.data.message);
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
      .addCase(
        fetchTeamMembers.fulfilled,
        (state: TeamState, action: PayloadAction<TeamMemberData[]>) => {
          state.loading = false;
          state.teamMember = action.payload;
        }
      )
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teamMemberSlice.reducer;
