import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import loadable from "@loadable/component";
import { useSelector } from "react-redux";

//Custom Hook
import useMediaQuery from "../shared/hooks/media-query-hook";

//PAGE
import RootLayout from "../shared/pages/layouts/RootLayout";

// import BlogLayout from "../shared/pages/layouts/BlogLayout";
import HomePage from "../shared/pages/HomePage";
// import AboutPage from "../shared/pages/AboutPage";
// import NotFoundPage from "../shared/pages/NotFoundPage";
// import ErrorPage from "../shared/pages/ErrorPage";
// import AuthPage from "../users/pages/AuthPage";
// import NewPostPage from "../blogs/pages/NewPostPage";
// import PostPage from "../blogs/pages/PostPage";
// import PostsPage from "../blogs/pages/PostsPage";
// import TestPage from "../shared/pages//TestPage";

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
const PostsPage = loadable(
  () => import("../blogs/pages/PostsPage"),
  loadingFallback
);
const TestPage = loadable(
  () => import("../shared/pages/TestPage"),
  loadingFallback
);

export function RouteCreate() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  //Custom Hook
  const { matches } = useMediaQuery("min", "768");

  // Route Setting
  let newBlogRoute = null;
  let editBlogRoute = null;
  let authRoute = null;
  if (isLoggedIn) {
    newBlogRoute = (
      <Route path="new-blog" element={<NewPostPage />} loader={null} />
    );
    editBlogRoute = (
      <Route path="edit-blog" element={<NewPostPage />} loader={null} />
    );
  } else {
    authRoute = !matches ?
      <Route path="/auth" element={<AuthPage />} loader={null} />
    : <Route path="/auth" element={<Navigate replace to="/" />} loader={null} />;
  }

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route index element={<HomePage />} loader={null} />
        <Route path="/blog" element={<BlogLayout />} loader={null}>
          <Route index element={<PostsPage />} loader={null} />
          {newBlogRoute}
          {editBlogRoute}
          <Route path=":blogId" element={<PostPage />} loader={null} />
        </Route>
        <Route path="/about" element={<AboutPage />} loader={null} />
        {authRoute}
        <Route path="/test" element={<TestPage />} loader={null} />
        <Route path="/*" element={<NotFoundPage />} loader={null} />
        {/* <Route path="/*" element={<Navigate replace to="/" />} loader={null} /> */}
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
