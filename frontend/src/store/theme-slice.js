import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: true };
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDark: (state) => {
      state.value = true;
    },
    setLight: (state) => {
      state.value = false;
    },
    setTheme: (state, action) => {
      if (typeof action.payload.value == "boolean")
        state.value = action.payload.value;
    },
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
