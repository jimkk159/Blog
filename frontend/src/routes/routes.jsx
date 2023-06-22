import { lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import RootLayout from "./pages/Root";
import * as authHelper from "../utils/auth";
import { SuspenseWrapper } from "../components/Wrapper/AwaitWrapper";

const AuthPage = lazy(() => import("./pages/Auth/Auth"));
const OauthPage = lazy(() => import("./pages/Auth/Oauth"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPassword"));

const AboutPage = lazy(() => import("./pages/About/Index"));
const ProfilePage = lazy(() => import("./pages/User/Profile"));
const EditAboutPage = lazy(() => import("./pages/About/Edit"));

const BrowsePage = lazy(() => import("./pages/Post/Browse"));
const NewPostPage = lazy(() => import("./pages/Post/New"));
const EditPostPage = lazy(() => import("./pages/Post/Edit"));
const SearchPage = lazy(() => import("./pages/Post/Search"));
const PostDetailPage = lazy(() => import("./pages/Post/Detail"));
const PostsRelationRootLayout = lazy(() =>
  import("./pages/Post/RelationRoot")
);

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
    loader: lazyLoader("./pages/Root"),
    children: [
      {
        id: "home",
        index: true,
        element: <HomePage />,
        loader: lazyLoader("./pages/Home"),
      },
      {
        id: "relation",
        path: "posts",
        loader: lazyLoader("./pages/Post/RelationRoot"),
        element: SuspenseWrapper(<PostsRelationRootLayout />),
        children: [
          {
            index: true,
            element: SuspenseWrapper(<BrowsePage />),
            loader: lazyLoader("./pages/Post/Browse"),
          },
          {
            id: "post-detail",
            path: ":pid",
            loader: lazyLoader("./pages/Post/Detail"),
            children: [
              {
                index: true,
                element: SuspenseWrapper(<PostDetailPage />),
                action: lazyAction("./pages/Post/Detail"),
              },
              {
                path: "edit",
                element: SuspenseWrapper(<EditPostPage />),
                loader: authHelper.checkAuthTokenLoader,
                action: lazyAction("./pages/Post/Edit"),
              },
            ],
          },
          {
            path: "new",
            element: SuspenseWrapper(<NewPostPage />),
            loader: authHelper.checkAuthTokenLoader,
            action: lazyAction("./pages/Post/New"),
          },
          {
            path: "search",
            element: SuspenseWrapper(<SearchPage />),
            loader: lazyLoader("./pages/Post/Search"),
            action: lazyAction("./pages/Post/Search"),
          },
        ],
      },
      {
        path: "auth",
        element: SuspenseWrapper(<AuthPage />),
        action: lazyAction("./pages/Auth/Auth"),
      },
      {
        id: "about",
        path: "about",
        loader: lazyLoader("./pages/About/Index"),
        children: [
          {
            index: true,
            element: SuspenseWrapper(<AboutPage />),
          },
          {
            path: "edit",
            element: SuspenseWrapper(<EditAboutPage />),
            loader: authHelper.checkAuthTokenLoader,
            action: lazyAction("./pages/About/Edit"),
          },
        ],
      },
      { path: "oauth/success", element: SuspenseWrapper(<OauthPage />) },
      {
        path: "logout",
        action: lazyAction("./pages/Auth/Logout"),
      },
      {
        path: "forgot_password",
        element: SuspenseWrapper(<ForgotPasswordPage />),
        action: lazyAction("./pages/Auth/ForgotPassword"),
      },
      {
        path: "profile",
        children: [
          {
            index: true,
            element: SuspenseWrapper(<ProfilePage />),
            loader: lazyLoader("./pages/User/Profile"),
          },
          {
            path: ":id",
            element: SuspenseWrapper(<ProfilePage />),
            loader: lazyLoader("./pages/User/Profile"),
          },
        ],
      },
      {
        path: "update_password",
        loader: authHelper.checkAuthTokenLoader,
        action: lazyAction("./pages/Auth/UpdatePassword"),
      },
      {
        path: "/oauth/success",
        element: <OauthPage />,
      },
      { path: "*", element: SuspenseWrapper(<Navigate replace to="/" />) },
    ],
  },
]);

function Route() {
  return <RouterProvider router={router} />;
}

export default Route;
