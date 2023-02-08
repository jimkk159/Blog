import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  uid: null,
  name:null,
  avatar: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.uid = action.payload.uid;
      state.isAdmin = action.payload.isAdmin;
      state.isLoggedIn = true;
      state.name = action.payload.name;
      state.avatar = action.payload.avatar;
      state.token = action.payload.token;
      state.expiration = action.payload.expiration;
    },
    logout: (state) => {
      state.uid = null;
      state.isAdmin = false;
      state.isLoggedIn = false;
      state.name = null;
      state.avatar = null;
      state.token = null;
      state.expiration = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

//reference:https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
//reference2:https://stackoverflow.com/questions/73952965/redux-toolkit-save-state-to-local-storage/73968086#73968086
//reference3:https://redux-toolkit.js.org/rtk-query/usage/migrating-to-rtk-query#implementation-using-createslice--createasyncthunk
