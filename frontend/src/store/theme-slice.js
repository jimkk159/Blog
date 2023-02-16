import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: true };
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggle: (state) => {
      console.log(state.value);
      state.value = !state.value;
    },
  },
});

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
