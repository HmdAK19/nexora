import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ColorMode = 'dark' | 'light';
interface PreferencesState {
  colorMode: ColorMode;
  compactNumbers: boolean;
}
const initialState: PreferencesState = {
  colorMode: 'dark',
  compactNumbers: false,
};
const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setColorMode: (state, action: PayloadAction<ColorMode>) => {
      state.colorMode = action.payload;
    },
    toggleColorMode: (state) => {
      state.colorMode = state.colorMode === 'dark' ? 'light' : 'dark';
    },
    setCompactNumbers: (state, action: PayloadAction<boolean>) => {
      state.compactNumbers = action.payload;
    },
  },
});
export const { setColorMode, toggleColorMode, setCompactNumbers } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
