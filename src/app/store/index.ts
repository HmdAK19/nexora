import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

import { preferencesReducer } from './preferencesSlice';

export { useAppDispatch, useAppSelector } from './hooks';
export { setColorMode, toggleColorMode } from './preferencesSlice';

const rootReducer = combineReducers({
  preferences: preferencesReducer,
});
const persistedReducer = persistReducer(
  {
    key: 'nexora',
    storage,
    whitelist: ['preferences'],
    version: 1,
  },
  rootReducer
);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
