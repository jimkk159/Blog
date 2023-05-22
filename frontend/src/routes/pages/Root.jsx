import { useEffect } from "react";
import * as authHelper from "../../utils/auth";
import MainNavigation from "../../components/MainNavigation";
import { Outlet, useSubmit, useLoaderData } from "react-router-dom";

import cubeImg from "../img/cube.png";

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
    <div
      className="bg-black text-navy-100"
      style={{ backgroundImage: `url(${cubeImg})` }}
    >
      <MainNavigation />
      <Outlet />
    </div>
  );
}

export default Root;
