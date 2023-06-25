import { redirect } from "react-router-dom";

// redux
import store from "../../../store";
import { authActions } from "../../../store/auth-slice";

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;

  store.dispatch(
    authActions.login({
      id: searchParams.get("id"),
      role: searchParams.get("role"),
      name: searchParams.get("name"),
      avatar: searchParams.get("avatar"),
    })
  );

  localStorage.setItem("token", searchParams.get("token"));
  return redirect("/oauth/close");
}
