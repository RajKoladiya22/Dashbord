import { configureStore, combineReducers } from '@reduxjs/toolkit';
import themeReducer, { ThemeState } from './theme/themeSlice';
import { persistReducer, persistStore, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import customerReducer from './slice/customer/addcustomerSlice';
import authReducer from './slice/auth/loginSlice';
import teamReducer from './slice/auth/teamRegisterSlice';
import teamMemberReducer from './slice/team/teamMemberSlice'
import partnerMemberReducer from './slice/partner/partnerMemberSlice'
import partnerReducer from './slice/auth/partnerRegisterSlice';
import customFieldsReducer from './slice/customer/customfieldSlice'

// Define the state shape
interface RootState {
  theme: ThemeState;
  customer: ReturnType<typeof customerReducer>;
  auth: ReturnType<typeof authReducer>;
  team: ReturnType<typeof teamReducer>; 
  teamMember : ReturnType<typeof teamMemberReducer>
  partner: ReturnType<typeof partnerReducer>; 
  partnerMember: ReturnType<typeof partnerMemberReducer>; 
  customFields: ReturnType<typeof customFieldsReducer>;
}

// Combine reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  customer: customerReducer,
  auth: authReducer,
  team: teamReducer, 
  teamMember: teamMemberReducer,
  partner: partnerReducer, 
  partnerMember: partnerMemberReducer, 
  customFields: customFieldsReducer,
});

// Persist config with RootState
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['auth']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);

// Type for RootState
export type { RootState };

export type AppDispatch = typeof store.dispatch;

