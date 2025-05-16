// src/store/slices/customerSlice.ts

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
  PayloadAction,
  EntityStateAdapter
} from "@reduxjs/toolkit";
import { Customer, ListCustomersArgs, PaginationMeta } from "../../APITypes";


// ① Create the adapter
const customerAdapter = createEntityAdapter<Customer>({
  selectId: (c:any) => c.id,
  sortComparer: (a, b) => a.companyName.localeCompare(b.companyName),
});

interface CustomerState extends EntityStateAdapter<Customer> {
  loading: boolean;
  error: string | null;
  meta: PaginationMeta;
  lastArgs?: ListCustomersArgs;
}

const initialState: CustomerState = customerAdapter.getInitialState({
  loading: false,
  error: null,
  meta: { total: 0, page: 1, limit: 10, pages: 1 },
});
