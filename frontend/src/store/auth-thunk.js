import { authActions } from "./auth-slice";

//Async Thunk
export const loginAuto = (userData) => {
  return async (dispatch) => {
    dispatch(authActions.login(userData));
    //Set User Info(LocalStorage Sync & Side effect)
    localStorage.setItem(
      "userData",
      JSON.stringify({
        uid: userData.uid,
        isAdmin: userData.isAdmin,
        name: userData.name,
        avatar: userData.avatar,
        token: userData.token,
        theme: userData.theme,
        language: userData.language,
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
