import { configureStore, combineReducers } from '@reduxjs/toolkit';
import themeReducer, { ThemeState } from './theme/themeSlice';
import { persistReducer, persistStore, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import customerReducer from './slice/customer/addcustomerSlice';

// Define the state shape
interface RootState {
  theme: ThemeState;
  customer: ReturnType<typeof customerReducer>;
}

// Combine reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  customer: customerReducer,
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
