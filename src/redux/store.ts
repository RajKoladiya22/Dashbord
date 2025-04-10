import { configureStore, combineReducers } from '@reduxjs/toolkit';
import themeReducer, { ThemeState } from './theme/themeSlice';
import { persistReducer, persistStore, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import customerReducer from './slice/customer/addcustomerSlice';
import authReducer from './slice/auth/loginSlice';

// Define the state shape
interface RootState {
  theme: ThemeState;
  customer: ReturnType<typeof customerReducer>;
  auth: ReturnType<typeof authReducer>;
}

// Combine reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  customer: customerReducer,
  auth: authReducer,
});

// Persist config with RootState
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  version: 1,
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

