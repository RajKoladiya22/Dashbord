import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer, { ThemeState } from "./theme/themeSlice";
import { persistReducer, persistStore, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slice/auth/authSlice";
import customerReducer from "./slice/customer/addcustomerSlice";
import userReducer from "./slice/user/userProfileSlice";
import teamReducer from "./slice/auth/teamRegisterSlice";
import teamMemberReducer from "./slice/team/teamMemberSlice";
import partnerMemberReducer from "./slice/partner/partnerMemberSlice";
import partnerReducer from "./slice/auth/partnerRegisterSlice";
import customFieldsReducer from "./slice/customer/customfieldSlice";
import productsReducer from "./slice/products/productSlice";
import reminderReducer from "./slice/products/reminder.slice";
import planReducer from "./slice/plan/planSlice";

// Define the state shape
interface RootState {
  theme: ThemeState;
  customer: ReturnType<typeof customerReducer>;
  auth: ReturnType<typeof authReducer>;
  profile: ReturnType<typeof userReducer>;
  team: ReturnType<typeof teamReducer>;
  teamMember: ReturnType<typeof teamMemberReducer>;
  partner: ReturnType<typeof partnerReducer>;
  partnerMember: ReturnType<typeof partnerMemberReducer>;
  customFields: ReturnType<typeof customFieldsReducer>;
  products: ReturnType<typeof productsReducer>;
  reminders: ReturnType<typeof reminderReducer>;
  plans: ReturnType<typeof planReducer>;
}

// Combine reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  customer: customerReducer,
  auth: authReducer,
  profile: userReducer,
  team: teamReducer,
  teamMember: teamMemberReducer,
  partner: partnerReducer,
  partnerMember: partnerMemberReducer,
  customFields: customFieldsReducer,
  products: productsReducer,
  reminders: reminderReducer,
  plans: planReducer,
});

// Persist config with RootState
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["auth", "team", "partner"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // Faster dev experience without full disable
      // ignoredActions: ['persist/PERSIST'],
    }),
  // devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Type for RootState
export type { RootState };

export type AppDispatch = typeof store.dispatch;
