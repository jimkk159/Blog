import { useEffect } from "react";
import cubeImg from "../img/cube.png";
import Footer from "../../components/UI/Footer";
import * as authHelper from "../../utils/auth";
import MainNavigation from "../../components/UI/MainNavigation";
import { Outlet, useSubmit, useLoaderData } from "react-router-dom";

function Root() {
  const submit = useSubmit();
  const token = useLoaderData();

  const handleStorageChange = (event) => {
    if (event.key === "token")
      window.location.replace(
        `${window.location.protocol}//${window.location.host}`
      );
  };

  useEffect(() => {
    if (!token) return;
    if (authHelper.isTokenExpired(token))
      return submit(null, { action: "/logout", method: "post" });

    const tokenDuration = authHelper.getTokenDuration(token);
    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div
      className="min-h-screen bg-black text-white w-full"
      style={{ backgroundImage: `url(${cubeImg})` }}
    >
      <MainNavigation />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Root;
