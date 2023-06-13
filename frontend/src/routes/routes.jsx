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
import { SuspenseWrapper } from "./helper/Wrapper";

const AuthPage = lazy(() => import("./pages/Auth/Auth"));
const OauthPage = lazy(() => import("./pages/Auth/Oauth"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPassword"));

const AboutPage = lazy(() => import("./pages/User/About"));
const EditAboutPage = lazy(() => import("./pages/User/EditAbout"));
const ProfilePage = lazy(() => import("./pages/User/Profile"));
const ProfileRootLayout = lazy(() => import("./pages/User/ProfileRoot"));
const BrowserProfilePage = lazy(() => import("./pages/User/BrowserProfile"));

const PostsPage = lazy(() => import("./pages/Post/Posts"));
const NewPostPage = lazy(() => import("./pages/Post/NewPost"));
const EditPostPage = lazy(() => import("./pages/Post/EditPost"));
const PostsLayout = lazy(() => import("./pages/Post/PostsRoot"));
const SearchPage = lazy(() => import("./pages/Post/SearchPost"));
const PostDetailPage = lazy(() => import("./pages/Post/PostDetail"));
const PostsRelationRootLayout = lazy(() =>
  import("./pages/Post/PostsRelationRoot")
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
    loader: authHelper.getAuthToken,
    children: [
      { index: true, element: <HomePage /> },
      {
        id: "relation",
        path: "posts",
        loader: lazyLoader("./pages/Post/PostsRelationRoot"),
        element: SuspenseWrapper(<PostsRelationRootLayout />),
        children: [
          {
            id: "posts",
            path: "",
            loader: lazyLoader("./pages/Post/PostsRoot"),
            element: SuspenseWrapper(<PostsLayout />),
            children: [
              {
                index: true,
                element: SuspenseWrapper(<PostsPage />),
              },
              {
                id: "post-detail",
                path: ":pid",
                loader: lazyLoader("./pages/Post/PostDetail"),
                children: [
                  {
                    index: true,
                    element: SuspenseWrapper(<PostDetailPage />),
                    action: lazyAction("./pages/Post/PostDetail"),
                  },
                  {
                    path: "edit",
                    element: SuspenseWrapper(<EditPostPage />),
                    loader: authHelper.checkAuthTokenLoader,
                    action: lazyAction("./pages/Post/EditPost"),
                  },
                ],
              },
              {
                path: "new",
                element: SuspenseWrapper(<NewPostPage />),
                loader: authHelper.checkAuthTokenLoader,
                action: lazyAction("./pages/Post/NewPost"),
              },
            ],
          },
          {
            path: "search",
            element: SuspenseWrapper(<SearchPage />),
            loader: lazyLoader("./pages/Post/SearchPost"),
            action: lazyAction("./pages/Post/SearchPost"),
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
        loader: lazyLoader("./pages/User/About"),
        children: [
          {
            index: true,
            element: SuspenseWrapper(<AboutPage />),
          },
          {
            path: "edit",
            element: SuspenseWrapper(<EditAboutPage />),
            loader: authHelper.checkAuthTokenLoader,
            action: lazyAction("./pages/User/EditAbout"),
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
        id: "profile",
        element: SuspenseWrapper(<ProfileRootLayout />),
        loader: lazyLoader("./pages/User/ProfileRoot"),
        children: [
          {
            index: true,
            element: SuspenseWrapper(<ProfilePage />),
            action: lazyAction("./pages/User/Profile"),
          },
          {
            path: ":id",
            element: SuspenseWrapper(<BrowserProfilePage />),
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
