import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the sign-up payload interface.
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactNumber: string;
  companyName: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
  planStatus: string; // e.g., 'active', 'inactive', 'free trial'
  role: string;       // e.g., 'admin'
}

// Define the interface for the expected response payload.
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

// Async thunk to handle sign-up.
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (signupData: SignUpData, { rejectWithValue }) => {
    try {
      // Send POST request to the sign-up API.
      const response = await axios.post<AuthResponse>(
        'http://localhost:5000/api/auth/signup',
        signupData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      // Return a rejected promise with a custom error message.
      return rejectWithValue(error.response?.data || 'Signup failed');
    }
  }
);

// Create the auth slice.
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous logout action.
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
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
