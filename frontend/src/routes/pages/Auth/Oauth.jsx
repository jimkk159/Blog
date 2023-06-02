import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { authActions } from "../../../store/auth-slice";

function OauthPage() {
  const searchParams = useSearchParams()[0];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      authActions.login({
        id: searchParams.get("id"),
        role: searchParams.get("role"),
        name: searchParams.get("name"),
        avatar: searchParams.get("avatar"),
      })
    );
    localStorage.setItem("token", searchParams.get("token"));
    window.close();
  }, [dispatch, searchParams]);
}

export default OauthPage;
