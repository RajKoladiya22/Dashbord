import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the login request payload interface.
export interface LoginCredentials {
  identifier: string;  // Can be email or username.
  password: string;
}

// Define the interface for the expected response payload.
// Adjust properties to match your backend API response.
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
    // add other user properties if needed
  };
}

// Define the auth slice state.
interface AuthState {
  currentUser: AuthResponse | null;
  loading: boolean;
  error: string | null;
}

// Initial state for authentication.
const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

// Async thunk to handle login.
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Send POST request to the login API.
      const response = await axios.post<AuthResponse>(
        'http://localhost:5000/api/auth/signin',
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      console.log(response);
      

      return response.data;
    } catch (error: any) {
      // Return a rejected promise with a custom error message.
    //   console.log(error);
      console.log(error)
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Create the auth slice.
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Optional synchronous reducer to logout.
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
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
