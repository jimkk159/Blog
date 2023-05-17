import store from "../../store";
import { redirect } from "react-router-dom";
import { authActions } from "../../store/auth-slice";

export function action() {
  localStorage.removeItem("token");
  store.dispatch(authActions.logout());
  return redirect("/");
}
