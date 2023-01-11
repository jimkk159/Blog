import { authActions } from "./auth-slice";

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
