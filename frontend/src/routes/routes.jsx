import { lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import RootLayout from "./pages/Root";
import * as authHelper from "../util/auth";
import { SuspenseWrapper } from "./helper/Wrapper";
import UpdatePassword from "./pages/UpdatePassword";
import SearchPage, {
  action as SearchAction,
  loader as SearchLoader,
} from "./pages/Search";

const AboutPage = lazy(() => import("./pages/About"));
const AuthPage = lazy(() => import("./pages/Auth"));
// const SearchPage = lazy(() => import("./pages/Search"));
const PostsRootLayout = lazy(() => import("./pages/PostsRoot"));
const PostsPage = lazy(() => import("./pages/Posts"));
const PostDetailPage = lazy(() => import("./pages/PostDetail"));
const EditPostPage = lazy(() => import("./pages/EditPost"));
const NewPostPage = lazy(() => import("./pages/NewPost"));
const OauthPage = lazy(() => import("./pages/Oauth"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword"));
const ProfilePage = lazy(() => import("./pages/Profile"));

const lazyLoader = (path) => (input) =>
  import(`${path}`).then((module) => module.loader(input));

const lazyAction = (path) => (input) =>
  import(`${path}`).then((module) => module.action(input));

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: authHelper.getAuthToken,
    children: [
      {
        index: true,
        element: <HomePage />,
        action: lazyAction("./pages/Home"),
      },
      {
        path: "auth",
        element: SuspenseWrapper(<AuthPage />),
        action: lazyAction("./pages/Auth"),
      },
      {
        path: "about",
        element: SuspenseWrapper(<AboutPage />),
        loader: lazyLoader("./pages/About"),
      },
      {
        id: "posts",
        path: "posts",
        element: SuspenseWrapper(<PostsRootLayout />),
        loader: lazyLoader("./pages/PostsRoot"),
        children: [
          {
            index: true,
            element: SuspenseWrapper(<PostsPage />),
          },
          {
            id: "post-detail",
            path: ":pid",
            loader: lazyLoader("./pages/PostDetail"),
            children: [
              {
                index: true,
                element: SuspenseWrapper(<PostDetailPage />),
                action: lazyAction("./pages/PostDetail"),
              },
              {
                path: "edit",
                element: SuspenseWrapper(<EditPostPage />),
                loader: authHelper.checkAuthTokenLoader,
                action: lazyAction("../components/PostForm"),
              },
            ],
          },
          {
            path: "new",
            element: SuspenseWrapper(<NewPostPage />),
            loader: authHelper.checkAuthTokenLoader,
            action: lazyAction("../components/PostForm"),
          },
          {
            path: "search",
            element: <SearchPage />,
            loader: SearchLoader,
            action: SearchAction,
          },
        ],
      },
      { path: "oauth/success", element: SuspenseWrapper(<OauthPage />) },
      {
        path: "logout",
        action: lazyAction("./pages/Logout"),
      },
      {
        path: "forgot_password",
        element: SuspenseWrapper(<ForgotPasswordPage />),
        action: lazyAction("./pages/ForgotPassword"),
      },
      {
        path: "profile",
        children: [
          { index: true, element: SuspenseWrapper(<ProfilePage />) },
          {
            path: "update_password",
            element: SuspenseWrapper(<UpdatePassword />),
            action: lazyAction("./pages/UpdatePassword"),
          },
        ],
      },
      { path: "*", element: SuspenseWrapper(<Navigate replace to="/" />) },
    ],
  },
]);

function Route() {
  return <RouterProvider router={router} />;
}

export default Route;
