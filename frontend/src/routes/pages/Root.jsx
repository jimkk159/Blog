import { useEffect } from "react";
import {
  json,
  defer,
  Outlet,
  useSubmit,
  useLoaderData,
} from "react-router-dom";

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

async function PostsLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/home`
  );

  if (!response.ok)
    throw json({ message: "Could not fetch posts." }, { status: 404 });

  const resJSON = await response.json();

  if (!resJSON.data)
    throw json({ message: "Could not fetch posts." }, { status: 404 });

  return resJSON.data;
}

export function loader() {
  return defer({ posts: PostsLoader(), token: authHelper.getAuthToken() });
}
