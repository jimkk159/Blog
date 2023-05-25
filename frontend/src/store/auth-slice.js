import { createSlice } from "@reduxjs/toolkit";
import { action } from "../routes/pages/Profile";

const initialState = {
  id: null,
  isRoot: false,
  name: null,
  avatar: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.isRoot = action.payload.role === "root";
      state.name = action.payload.name;
      state.avatar = action.payload.avatar;
    },
    logout: (state) => {
      state.id = null;
      state.isRoot = false;
      state.name = null;
      state.avatar = null;
    },
    updateAvatar: (state, action) => {
      state.avatar = action.payload.avatar;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
