import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthResponse, LoginCredentials, AuthState } from "../../types";
import axiosInstance from "../../../utils/axiosInstance";
import Cookies from 'js-cookie';

// Initial state for authentication.
const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

// Async thunk to handle login.
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Send POST request to the login API.
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/signin",
        credentials
      );

      // console.log(response.data);


      // Save token and user data in cookies:
      Cookies.set("xRo%pAkEjfmJ", response.data.data.token, {
        // httpOnly: true,
        expires: 1, // Expires in 1 day; adjust as necessary.
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });



      return response.data;
    } catch (error: any) {
      // Return a rejected promise with a custom error message.
      //   console.log(error);
      // console.log(error)
      return rejectWithValue(error.response?.data.message || "Login failed");
    }
  }
);

// Create the auth slice.
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Optional synchronous reducer to logout.
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.currentUser = action.payload;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the logout action if needed.
export const { logout } = authSlice.actions;

// Export the auth reducer.
export default authSlice.reducer;
