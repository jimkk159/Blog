import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tags: [],
};

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    init: (state) => {
      state = initialState;
    },
    update: (state, action) => {
      state.tags = [...action.payload.tags];
    },
    add: (state, action) => {
      state.tags = [...state.tags, action.payload.tag];
    },
    remove: (state, action) => {
      state.tags = state.tags.filter((el) => el.id !== action.payload.id);
    },
    reset: (state) => {
      state.tags = [];
    },
  },
});

export const tagActions = tagSlice.actions;

export default tagSlice.reducer;
