import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
};

const catalogueSlice = createSlice({
  name: "catalogue",
  initialState,
  reducers: {
    set: (state, action) => {
      state.name = action.payload.name;
    },
    reset: (state) => {
      state.name = null;
    },
  },
});

export const catalogueActions = catalogueSlice.actions;

export default catalogueSlice.reducer;
