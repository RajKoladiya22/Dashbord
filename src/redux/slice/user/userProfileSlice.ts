// src/slices/userProfile/userProfileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import {
  UserProfile,
  UserProfileResponse,
  UserProfileState,
} from "../../APITypes";

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<UserProfileResponse>(
        "/users/profile"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "userProfile/updateUserProfile",
  async (payload: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<UserProfileResponse>(
        "/users/update-profile",
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Delete user profile
export const deleteUserProfile = createAsyncThunk(
  "userProfile/deleteUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<UserProfileResponse>(
        "/users/delete-profile"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete profile"
      );
    }
  }
);

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUserProfile.fulfilled,
      (state, action: PayloadAction<UserProfileResponse>) => {
        state.loading = false;
        state.profile = action.payload.data.user;
      }
    );
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateUserProfile.fulfilled,
      (state, action: PayloadAction<UserProfileResponse>) => {
        state.loading = false;
        state.profile = action.payload.data.user;
      }
    );
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete profile
    builder.addCase(deleteUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUserProfile.fulfilled, (state) => {
      state.loading = false;
      state.profile = null;
    });
    builder.addCase(deleteUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default userProfileSlice.reducer;
