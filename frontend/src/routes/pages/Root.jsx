import { useEffect } from "react";
import * as authHelper from "../../util/auth";
import SearchBar from "../../components/SearchBar"
import MainNavigation from "../../components/MainNavigation";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";

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
      <SearchBar />
      <MainNavigation />
      <h1>Root layout</h1>
      <Outlet />
    </>
  );
}

export default Root;
