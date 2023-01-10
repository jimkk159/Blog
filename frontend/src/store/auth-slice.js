import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userId: null,
  avatar: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.uid;
      state.isLoggedIn = true;
      state.avatar = action.payload.image;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.userId = null;
      state.isLoggedIn = false;
      state.avatar = null;
      state.token = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
