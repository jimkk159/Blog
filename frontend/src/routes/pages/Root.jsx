import { useEffect } from "react";
import * as authHelper from "../../utils/auth";
import MainNavigation from "../../components/MainNavigation";
import {
  Outlet,
  useSubmit,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router-dom";
import cubeImg from "../img/cube.png";

function Root() {
  const submit = useSubmit();
  const token = useLoaderData();
  const navigate = useNavigate();

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
      className="min-h-screen bg-black text-navy-100"
      style={{ backgroundImage: `url(${cubeImg})` }}
    >
      <MainNavigation />
      <Outlet />
    </div>
  );
}

export default Root;
