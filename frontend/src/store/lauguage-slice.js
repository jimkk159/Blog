import { createSlice } from "@reduxjs/toolkit";

const initialState = { language: null };
const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {},
});

export const languageActions = languageSlice.actions;

export default languageSlice.reducer;
