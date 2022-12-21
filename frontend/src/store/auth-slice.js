import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: true,
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.uid;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userId = null;
      state.isLoggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
