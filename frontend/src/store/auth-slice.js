import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: null,
  avatar: null,
  role: null,
  isRoot: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.avatar = action.payload.avatar;
      state.role = action.payload.role;
      state.isRoot = action.payload.role === "root" || "admin";
    },
    logout: (state) => {
      state.id = null;
      state.isRoot = false;
      state.name = null;
      state.avatar = null;
      state.role = null;
    },
    updateAvatar: (state, action) => {
      state.avatar = action.payload.avatar;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
