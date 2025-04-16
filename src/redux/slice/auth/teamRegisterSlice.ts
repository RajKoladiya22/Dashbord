import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {TeamMemberData, TeamMembersignUpResponse, TeamState} from '../../types'


const initialState: TeamState = {
  teamMember: null,
  loading: false,
  error: null,
};

// Async thunk to create a team member
export const createTeamMember = createAsyncThunk(
  'team/createTeamMember',
  async (teamMemberData: TeamMemberData, { rejectWithValue }) => {
    try {
      const response = await axios.post<TeamMembersignUpResponse>(
        'http://localhost:5000/api/auth/admin/team-members',
        teamMemberData,
        {
          withCredentials: true, // important for cookie-based auth
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
    
      return rejectWithValue(error.response?.data?.message || 'Failed to create team member');
    }
  }
);

export const resetStatus = () => {
    //
}

// Slice
const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearTeamMemberState: (state) => {
      state.teamMember = null;
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
      .addCase(createTeamMember.fulfilled, (state, action: PayloadAction<TeamMembersignUpResponse>) => {
        state.loading = false;
        state.teamMember = action.payload;
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTeamMemberState } = teamSlice.actions;

export default teamSlice.reducer;
