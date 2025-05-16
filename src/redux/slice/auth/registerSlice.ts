import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { SignUpData, AuthResponse, AuthState } from "../../APITypes";
import Cookies from "js-cookie";
import axiosInstance from "../../../utils/axiosInstance";

// Initial state for authentication.
const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

// Async thunk to handle sign-up.
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (signupData: SignUpData, { rejectWithValue }) => {
    try {
      // Send POST request to the sign-up API.
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/signup",
        signupData
      );
      Cookies.set("xRo%pAkEjfmJ", response.data.data.token, {
        // httpOnly: true,
        expires: 1, // Expires in 1 day; adjust as necessary.
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      // console.log("response------------------------->\n", response);
      
      return response.data;
    } catch (error: any) {
      // Return a rejected promise with a custom error message.
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

// Create the auth slice.
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous logout action.
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;

      Cookies.remove("xRo%pAkEjfmJ");
      Cookies.remove("rJmkUxzNakU");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.currentUser = action.payload;
        }
      )
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the logout action if needed.
export const { logout } = authSlice.actions;

// Export the auth reducer.
export default authSlice.reducer;
