import { useEffect } from "react";
import { defer, Outlet, useSubmit, useLoaderData } from "react-router-dom";

// image
import cubeImg from "../img/cube.png";

// helper
import * as authHelper from "../../utils/auth";

// components
import Footer from "../../components/UI/Footer";
import MainNavigation from "../../components/UI/MainNavigation";

function Root() {
  // react-router
  const submit = useSubmit();
  const { token } = useLoaderData();

  // custom functions
  const handleStorageChange = (event) => {
    if (event.key === "token")
      window.location.replace(
        `${window.location.protocol}//${window.location.host}`
      );
  };

  // useEffect
  useEffect(() => {
    // const timePreservation = 5;

    if (!token) return;
    if (authHelper.isTokenExpired(token))
      return submit(null, { action: "/logout", method: "post" });

    // const tokenDuration = authHelper.getTokenDuration(token) - timePreservation;
    const tokenDuration = 10 * 1000;

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
      className="min-h-screen w-full bg-black font-poppins text-self-gray"
      style={{ backgroundImage: `url(${cubeImg})` }}
    >
      <MainNavigation />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Root;

export function loader() {
  return defer({ token: authHelper.getAuthToken() });
}
