// src/redux/slice/reminders/remindersSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { ReminderData } from "../../../types/customer.type";

// Slice state
interface RemindersState {
  reminders: ReminderData[];
  loading: boolean;
  error: string | null;
}

const initialState: RemindersState = {
  reminders: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchReminders = createAsyncThunk<
  ReminderData[],
  {
    timeWindow?:
      | "next15"
      | "next30"
      | "nextMonth"
      | "last15"
      | "last30"
      | "custom"
      | "thisMonth";
    startDate?: string;
    endDate?: string;
    productName?: string;
    customerSearch?: string;
    partnerSearch?: string;
  },
  { rejectValue: string }
>("reminders/fetchReminders", async (params, { rejectWithValue }) => {
  try {
    // Build query string with only defined params
    const query = new URLSearchParams();
    query.set("timeWindow", params.timeWindow ?? "next15");
    if (params.timeWindow === "custom") {
      if (!params.startDate || !params.endDate) {
        return rejectWithValue(
          "Start and end dates must be provided for custom timeWindow."
        );
      }
      query.set("startDate", params.startDate);
      query.set("endDate", params.endDate);
    }
    if (params.productName) {
      query.set("productName", params.productName);
    }
    if (params.customerSearch) {
      query.set("customerSearch", params.customerSearch);
    }
    if (params.partnerSearch) {
      query.set("partnerSearch", params.partnerSearch);
    }

    // console.log("query--->", query);

    const response = await axiosInstance.get<{
      status: number;
      success: boolean;
      message: string;
      data: { reminders: ReminderData[] };
    }>(`/customer/reminders?${query.toString()}`);

    if (response.status !== 200 || !response.data.success) {
      throw new Error(response.data.message || "Failed to fetch reminders");
    }
    // console.log("data---->", response);

    return response.data.data.reminders;
  } catch (err: any) {
    return rejectWithValue(err.message || "Unexpected error");
  }
});

export const updateReminder = createAsyncThunk<
  ReminderData,
  { id: string; query: string; data: Partial<ReminderData> },
  { rejectValue: string }
>(
  "reminders/updateReminder",
  async ({ id, query, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<{
        status: number;
        success: boolean;
        message: string;
        data: { reminders: ReminderData };
      }>(`/customer/product/update/${id}?${query}`, data);

      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || "Failed to update reminder");
      }
      // Return a single updated reminder
      return response.data.data.reminders;
    } catch (err: any) {
      return rejectWithValue(err.message || "Unexpected error");
    }
  }
);

// Slice
const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = action.payload;
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load reminders";
      })

      .addCase(updateReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = state.reminders.filter(
          (prod) => prod.id !== action.payload.id
        );
      })
      .addCase(updateReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update reminder";
      }),
});

export default remindersSlice.reducer;
