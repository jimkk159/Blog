import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coverUrl: null,
  oriCoverUrl: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setUrl: (state, action) => {
      state.coverUrl = action.payload.url;
      state.oriCoverUrl = action.payload.url;
    },
    setCurrentUrl: (state, action) => {
      state.coverUrl = action.payload.url;
    },
    save: (state) => {
      state.oriCoverUrl = state.coverUrl;
    },
    cancel: (state) => {
      state.coverUrl = state.oriCoverUrl;
    },
    reset: (state) => {
      state.coverUrl = null;
      state.oriCoverUrl = null;
    },
  },
});
export const postActions = postSlice.actions;

export default postSlice.reducer;
