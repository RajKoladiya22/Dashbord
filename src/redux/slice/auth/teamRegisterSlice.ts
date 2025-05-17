import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  TeamMember,
  TeamMembersignUpResponse,
  TeamState,
} from "../../../types/team.type";
import axiosInstance from "../../../utils/axiosInstance";

const initialState: TeamState = {
  teamMember: [],
  loading: false,
  error: null,
};

// Async thunk to create a team member
export const createTeamMember = createAsyncThunk(
  "team/createTeamMember",
  async (teamMemberData: TeamMember, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<TeamMembersignUpResponse>(
        "/auth/team",
        teamMemberData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create team member"
      );
    }
  }
);

export const resetStatus = () => {
  //
};

// Slice
const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearTeamMemberState: (state) => {
      state.teamMember = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createTeamMember.fulfilled,
        (
          state
          //  action: PayloadAction<TeamMembersignUpResponse>
        ) => {
          state.loading = false;
          // state.teamMember = action.payload;
        }
      )
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTeamMemberState } = teamSlice.actions;

export default teamSlice.reducer;
