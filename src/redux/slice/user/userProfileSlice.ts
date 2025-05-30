// src/slices/userProfile/userProfileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import {
  ChangePassword,
  User,
  UserProfileResponse,
  UserProfileState,
} from "../../../types/user.type";

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<UserProfileResponse>(
        "/auth/profile"
      );
      // console.log(response.data);

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
  async (payload: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<UserProfileResponse>(
        "/auth/profile",
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



// Change Password
export const changePassword = createAsyncThunk<
ChangePassword,
ChangePassword
>("userProfile/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ChangePassword>(
      "/auth/reset-password",
      payload
    );
    // console.log(response);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to change password"
    );
  }
});

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
        state.profile = action.payload.data.profile;
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
        state.profile = action.payload.data.profile;
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

    // Change password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
      state.profile = null;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default userProfileSlice.reducer;
