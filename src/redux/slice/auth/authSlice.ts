// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import Cookies from "js-cookie";
import { AuthState, AuthResponse, LoginCredentials, User} from "../../../types/user.type";

// Initial state for authentication.
const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

// Async thunk to handle login.
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/signin",
      credentials
    );
    const { token } = response.data.data;

    // Save token in cookie
    Cookies.set("xRo%pAkEjfmJ", token, {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});

// Async thunk to handle sign-up.
export const signupUser = createAsyncThunk<
  AuthResponse,
  User,
  { rejectValue: string }
>("auth/signupUser", async (signupData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/signup",
      signupData
    );
    const { token } = response.data.data;

    // Save token in cookie
    Cookies.set("xRo%pAkEjfmJ", token, {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data.message || "Signup failed");
  }
});

// Create the auth slice.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
      Cookies.remove("xRo%pAkEjfmJ");
      Cookies.remove("rJmkUxzNakU");
    },
  },
  extraReducers: (builder) => {
    // Login
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

    // Signup
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

// Export the logout action and reducer.
export const { logout } = authSlice.actions;
export default authSlice.reducer;
