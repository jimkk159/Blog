import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isTag: false,
};

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    show: (state) => {
      state.isTag = true;
    },
    close: (state) => {
      state.isTag = false;
    },
    toggle: (state) => {
      state.isTag = !state.tag;
    },
  },
});
export const tagActions = tagSlice.actions;

export default tagSlice.reducer;
