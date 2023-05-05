import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import MainNavigation from "../../components/MainNavigation";
import { useEffect } from "react";
import * as authHelper from "../../util/auth";

function Root() {
  const token = useLoaderData();
  const submit = useSubmit();
  
  useEffect(() => {
    if (!token) return;
    if (authHelper.isTokenExpired(token))
      return submit(null, { action: "/logout", method: "post" });

    const tokenDuration = authHelper.getTokenDuration(token);
    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);

  }, [token, submit]);

  return (
    <>
      <MainNavigation />
      <h1>Root layout</h1>
      <Outlet />
    </>
  );
}

export default Root;
