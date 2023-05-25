import store from "../../store";
import { redirect } from "react-router-dom";
import * as authHelper from "../../utils/auth";
import { authActions } from "../../store/auth-slice";

export async function action({ request }) {
  const data = await request.formData();
  const token = authHelper.getAuthToken();

  const authData = {
    password: data.get("password"),
    newPassword: data.get("newPassword"),
    confirmNewPassword: data.get("confirmNewPassword"),
  };

  await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/auth/updatePassword",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(authData),
    }
  );

  store.dispatch(authActions.logout());
  localStorage.removeItem("token");
  return redirect("/");
}
