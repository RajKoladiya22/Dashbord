// src/slice/adminCustomFields/adminCustomFieldsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance"; // Your pre-configured axios instance

// Define the interface for a single admin custom field.
export interface AdminCustomField {
  id: string;
  admin_id: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  options: string[];
  is_multi_select: boolean;
  created_at: string;
  updated_at: string;
}

// Define the interface for the API response when fetching custom fields.
export interface CustomFieldsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    adminCustomFields: AdminCustomField[];
  };
}

// Define the interface for the API response when adding/updating/deleting a custom field.
export interface AddCustomFieldsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    adminCustomField: AdminCustomField;
  };
}

// Define the slice state.
interface CustomFieldsState {
  customFields: AdminCustomField[];
  loading: boolean;
  error: string | null;
}

// Initial state.
const initialState: CustomFieldsState = {
  customFields: [],
  loading: false,
  error: null,
};

// Async thunk to fetch custom fields.
export const fetchAdminCustomFields = createAsyncThunk(
  "adminCustomFields/fetchAdminCustomFields",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<CustomFieldsResponse>("/customer/customfield", {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch custom fields"
      );
    }
  }
);

// Async thunk to add a new custom field.
export const addAdminCustomField = createAsyncThunk(
  "adminCustomFields/addAdminCustomField",
  async (
    payload: {
      fieldName: string;
      fieldType: string;
      isRequired?: boolean;
      options?: string[];
      isMultiSelect?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post<AddCustomFieldsResponse>(
        "/customer/customfield",
        payload,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add custom field"
      );
    }
  }
);

// Async thunk to update an existing custom field.
export const updateAdminCustomField = createAsyncThunk(
  "adminCustomFields/updateAdminCustomField",
  async (
    payload: {
      id: string;
      fieldName: string;
      fieldType: string;
      isRequired?: boolean;
      options?: string[];
      isMultiSelect?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put<AddCustomFieldsResponse>(
        `/customer/customfield/${payload.id}`,
        payload,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update custom field"
      );
    }
  }
);

// Async thunk to delete a custom field.
export const deleteAdminCustomField = createAsyncThunk(
  "adminCustomFields/deleteAdminCustomField",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<AddCustomFieldsResponse>(
        `/customer/customfield/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete custom field"
      );
    }
  }
);

// Create the slice.
const adminCustomFieldsSlice = createSlice({
  name: "adminCustomFields",
  initialState,
  reducers: {
    // Optionally, add synchronous reducers here.
  },
  extraReducers: (builder) => {
    // Handle fetching custom fields.
    builder.addCase(fetchAdminCustomFields.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAdminCustomFields.fulfilled,
      (state, action: PayloadAction<CustomFieldsResponse>) => {
        state.loading = false;
        state.customFields = action.payload.data.adminCustomFields;
      }
    );
    builder.addCase(fetchAdminCustomFields.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Handle adding a new custom field.
    builder.addCase(addAdminCustomField.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addAdminCustomField.fulfilled,
      (state, action: PayloadAction<AddCustomFieldsResponse>) => {
        state.loading = false;
        const newField = action.payload.data.adminCustomField;
        state.customFields.push(newField);
      }
    );
    builder.addCase(addAdminCustomField.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Handle updating an existing custom field.
    builder.addCase(updateAdminCustomField.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateAdminCustomField.fulfilled,
      (state, action: PayloadAction<AddCustomFieldsResponse>) => {
        state.loading = false;
        const updatedField = action.payload.data.adminCustomField;
        state.customFields = state.customFields.map((field) =>
          field.id === updatedField.id ? updatedField : field
        );
      }
    );
    builder.addCase(updateAdminCustomField.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Handle deleting a custom field.
    builder.addCase(deleteAdminCustomField.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteAdminCustomField.fulfilled,
      (state, action: PayloadAction<AddCustomFieldsResponse>) => {
        state.loading = false;
        const deletedField = action.payload.data.adminCustomField;
        state.customFields = state.customFields.filter(
          (field) => field.id !== deletedField.id
        );
      }
    );
    builder.addCase(deleteAdminCustomField.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default adminCustomFieldsSlice.reducer;
