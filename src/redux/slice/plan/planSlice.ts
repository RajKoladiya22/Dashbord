import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { Plan, PlanResponse, PlanResponse2, PlanState } from "../../../types/plan.type";

// 1) Create a new plan
export const createPlan = createAsyncThunk(
  "plan/createPlan",
  async (payload: Partial<Plan>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<PlanResponse>("/plan", payload);
      // console.log(response.data.data.plan);

      return response.data.data.plan;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create new plan"
      );
    }
  }
);

// 2) Fetch all plans
export const fetchAllPlans = createAsyncThunk<
  PlanResponse2, // Return type: an array of plan.
  { status?: boolean; page?: number; limit?: number },
  { rejectValue: string }
>(
  "plan/fetchAllPlans",
  async ({ status, page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/plan", {
        params: { status, page, limit },
      });
      console.log("PLAN RESPONCE",response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);

// 4) Delete plan
export const deletePlan = createAsyncThunk(
  "plan/deletePlan",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<PlanResponse>(`/plan/${id}`);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete plan"
      );
    }
  }
);

// 5) change plan Status
export const togglePlanStatus = createAsyncThunk<
  Plan, // now returns one teamData
  { id: string | undefined; status: boolean },
  { rejectValue: string }
>("plan/toggleStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<{
      status: number;
      success: boolean;
      message: string;
      data: { plan: Plan };
    }>(`/plan/status/${id}`, { status });
    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to update plan status");
    }
    // console.log("plan ------> ", response);

    return response.data.data.plan;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState: PlanState = {
  plans: [],
  loading: false,
  error: null,
};

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create
    builder.addCase(createPlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPlan.fulfilled, (state, action: any) => {
      state.loading = false;
      state.plans.push(action.payload);
    });
    builder.addCase(createPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch
    builder.addCase(fetchAllPlans.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAllPlans.fulfilled,
      (state, action: PayloadAction<PlanResponse2>) => {
        // console.log(action.payload);

        state.loading = false;
        state.plans = Array.isArray(action.payload.data.plans)
          ? action.payload.data.plans
          : [action.payload.data.plans];
      }
    );
    builder.addCase(fetchAllPlans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete
    builder.addCase(deletePlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deletePlan.fulfilled,
      (state, action: PayloadAction<any>) => {
        // console.log('action ----> ',action);

        state.loading = false;
        state.plans = state.plans.filter(
          (plan) => plan.id !== action.payload.id
        );
      }
    );
    builder.addCase(deletePlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Plan Status Toggle
    builder.addCase(togglePlanStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(togglePlanStatus.fulfilled, (state, action: any) => {
      state.loading = false;
      state.plans = state.plans?.filter((p: any) => p.id !== action.payload.id);
    });
    builder.addCase(togglePlanStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Could not toggle status";
    });
  },
});

export default planSlice.reducer;
