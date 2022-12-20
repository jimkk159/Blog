import { createSlice } from "@reduxjs/toolkit";

//Language JSON
import ch from "../assets/translate/ch/table.json";
import en from "../assets/translate/en/table.json";

const initialState = {
  isEnglish: true,
  language: en,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggle: (state) => {
      state.isEnglish = !state.isEnglish;
      state.language = state.isEnglish ? en : ch;
    },
  },
});

export const languageActions = languageSlice.actions;

export default languageSlice.reducer;
