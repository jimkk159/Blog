import { lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "./pages/Error";
import RootLayout from "./pages/Root";
import * as authHelper from "../utils/auth";
import { SuspenseWrapper } from "./helper/Wrapper";

const AboutPage = lazy(() => import("./pages/User/About"));
const AuthPage = lazy(() => import("./pages/Auth/Auth"));
const SearchPage = lazy(() => import("./pages/Post/SearchPost"));
const PostsPage = lazy(() => import("./pages/Post/Posts"));
const PostsLayout = lazy(() => import("./pages/Post/PostsRoot"));
const PostsRelationRootLayout = lazy(() => import("./pages/Post/PostsRelationRoot"));
const PostDetailPage = lazy(() => import("./pages/Post/PostDetail"));
const EditPostPage = lazy(() => import("./pages/Post/EditPost"));
const NewPostPage = lazy(() => import("./pages/Post/NewPost"));
const OauthPage = lazy(() => import("./pages/Auth/Oauth"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPassword"));
const ProfileRootLayout = lazy(() => import("./pages/User/ProfileRoot"));
const ProfilePage = lazy(() => import("./pages/User/Profile"));
const BrowserProfilePage = lazy(() => import("./pages/User/BrowserProfile"));

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
        id: "relation",
        path: "/",
        loader: lazyLoader("./pages/PostsRelationRoot"),
        element: SuspenseWrapper(<PostsRelationRootLayout />),
        children: [
          {
            id: "posts",
            path: "/",
            loader: lazyLoader("./pages/PostsRoot"),
            element: SuspenseWrapper(<PostsLayout />),
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
                    action: lazyAction("./pages/EditPost"),
                  },
                ],
              },
              {
                path: "new",
                element: SuspenseWrapper(<NewPostPage />),
                loader: authHelper.checkAuthTokenLoader,
                action: lazyAction("./pages/NewPost"),
              },
            ],
          },
          {
            path: "search",
            element: SuspenseWrapper(<SearchPage />),
            loader: lazyLoader("./pages/Search"),
            action: lazyAction("./pages/Search"),
          },
        ],
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
        id: "profile",
        element: SuspenseWrapper(<ProfileRootLayout />),
        loader: lazyLoader("./pages/ProfileRoot"),
        children: [
          {
            index: true,
            element: SuspenseWrapper(<ProfilePage />),
            action: lazyAction("./pages/Profile"),
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
        action: lazyAction("./pages/UpdatePassword"),
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
