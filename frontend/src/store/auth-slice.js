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
      state.avatar = action.payload.avatar;
      state.token = action.payload.token;
      state.expiration = action.payload.expiration;
    },
    logout: (state) => {
      state.userId = null;
      state.isLoggedIn = false;
      state.avatar = null;
      state.token = null;
      state.expiration = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

//Async Thunk
export const loginAuto = (userData) => {
  return async (dispatch) => {
    dispatch(authActions.login(userData));
    //Set User Info(LocalStorage Sync & Side effect)
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userData.uid,
        avatar: userData.avatar,
        token: userData.token,
        expiration: userData.expiration,
      })
    );
  };
};

export const logoutAuto = () => {
  return async (dispatch) => {
    dispatch(authActions.logout());
    localStorage.removeItem("userData");
  };
};
//reference:https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
//reference2:https://stackoverflow.com/questions/73952965/redux-toolkit-save-state-to-local-storage/73968086#73968086
//reference3:https://redux-toolkit.js.org/rtk-query/usage/migrating-to-rtk-query#implementation-using-createslice--createasyncthunk
