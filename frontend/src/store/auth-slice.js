import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
