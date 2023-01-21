import React, { useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import loadable from "@loadable/component";
import { useSelector, useDispatch } from "react-redux";

//Redux Thunk
import { loginAuto, logoutAuto } from "../store/auth-thunk";

//Custom Hook
import useMediaQuery from "../shared/hooks/media-query-hook";

//PAGE
import HomeLayout from "../shared/pages/layouts/HomeLayout";
import RootLayout from "../shared/pages/layouts/RootLayout";
import PostsPage from "../blogs/pages/PostsPage";

//Custom Component
import LoadingSpinner from "../shared/components/UI/LoadingSpinner";

const loadingFallback = {
  fallback: (
    <div className="center">
      <LoadingSpinner />
    </div>
  ),
};

//React-route 6.4 Lazy Loading solution reference:
//https://www.robinwieruch.de/react-router-lazy-loading/
const BlogRootLayout = loadable(
  () => import("../blogs/pages/layout/BlogRootLayout"),
  loadingFallback
);
const BlogLayout = loadable(
  () => import("../blogs/pages/layout/BlogLayout"),
  loadingFallback
);
const AboutPage = loadable(
  () => import("../shared/pages/AboutPage"),
  loadingFallback
);
const NotFoundPage = loadable(
  () => import("../shared/pages/NotFoundPage"),
  loadingFallback
);
const ErrorPage = loadable(
  () => import("../shared/pages/ErrorPage"),
  loadingFallback
);
const AuthPage = loadable(
  () => import("../users/pages/AuthPage"),
  loadingFallback
);
const NewPostPage = loadable(
  () => import("../blogs/pages/NewPostPage"),
  loadingFallback
);
const PostPage = loadable(
  () => import("../blogs/pages/PostPage"),
  loadingFallback
);
const EditPage = loadable(
  () => import("../blogs/pages/EditPage"),
  loadingFallback
);
const SearchPage = loadable(
  () => import("../shared/pages/SearchPage"),
  loadingFallback
);

export function RouteCreate() {
  //Redux
  const { isLoggedIn, token, expiration, login, logout } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  //Set token automatically logout life cycle
  useEffect(() => {
    let logoutTimer;
    if (token && expiration) {
      const remainingTime =
        new Date(expiration).getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => {
        dispatch(logoutAuto());
      }, remainingTime);
    }
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [dispatch, token, expiration, logout]);

  //Automatically login
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.token && new Date(userData.expiration) > new Date()) {
      dispatch(
        loginAuto({
          uid: userData.userId,
          avatar: userData.avatar,
          token: userData.token,
          expiration: userData.expiration,
        })
      );
    }
  }, [dispatch, login]);

  //Custom Hook
  const { matches } = useMediaQuery("min", "768");

  // Route Setting
  let newBlogRoute = null;
  let editBlogRoute = null;
  let authRoute = null;
  if (isLoggedIn) {
    newBlogRoute = <Route path="new-blog" element={<NewPostPage />} />;
    editBlogRoute = <Route path="edit-blog" element={<NewPostPage />} />;
  } else {
    authRoute = !matches ? (
      <Route path="/auth" element={<AuthPage />} />
    ) : (
      <Route path="/auth" element={<Navigate replace to="/" />} />
    );
  }

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<PostsPage />} />
          <Route path="/about" element={<AboutPage />} />
          {authRoute}
          <Route path="/search/:searchItem" element={<SearchPage />}></Route>
          <Route path="/*" element={<NotFoundPage />} />
          {/* <Route path="/*" element={<Navigate replace to="/" />} loader={null} /> */}
        </Route>
        <Route path="/blog" element={<BlogRootLayout />}>
          <Route path="" element={<BlogLayout />}>
            <Route index element={<Navigate replace to="/" />} />
            {newBlogRoute}
            {editBlogRoute}
            <Route path=":blogId" element={<PostPage />} />
          </Route>
          <Route path="new" element={<EditPage />} />
        </Route>
      </Route>
    )
  );
  return routes;
}

function CustomRoute() {
  const router = RouteCreate();
  return <RouterProvider router={router} />;
}

export default CustomRoute;