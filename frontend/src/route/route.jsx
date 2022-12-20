import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import loadable from "@loadable/component";

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

const loadingContent = {
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
  loadingContent
);
const AboutPage = loadable(
  () => import("../shared/pages/AboutPage"),
  loadingContent
);
const NotFoundPage = loadable(
  () => import("../shared/pages/NotFoundPage"),
  loadingContent
);
const ErrorPage = loadable(
  () => import("../shared/pages/ErrorPage"),
  loadingContent
);
const AuthPage = loadable(
  () => import("../users/pages/AuthPage"),
  loadingContent
);
const NewPostPage = loadable(
  () => import("../blogs/pages/NewPostPage"),
  loadingContent
);
const PostPage = loadable(
  () => import("../blogs/pages/PostPage"),
  loadingContent
);
const PostsPage = loadable(
  () => import("../blogs/pages/PostsPage"),
  loadingContent
);
const TestPage = loadable(
  () => import("../shared/pages/TestPage"),
  loadingContent
);


function RouteCreate() {
  const { matches } = useMediaQuery("min", "768");
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route index element={<HomePage />} loader={null} />
        <Route path="/blog" element={<BlogLayout />} loader={null}>
          <Route index element={<PostsPage />} loader={null} />
          <Route
            index
            path="new-blog"
            element={<NewPostPage />}
            loader={null}
          />
          <Route path=":blogId" element={<PostPage />} loader={null} />
        </Route>
        <Route path="/about" element={<AboutPage />} loader={null} />
        {!matches && (
          <Route path="/auth" element={<AuthPage />} loader={null} />
        )}
        <Route path="/test" element={<TestPage />} loader={null} />
        <Route path="/*" element={<NotFoundPage />} loader={null} />
        {/* <Route path="/*" element={<Navigate replace to="/" />} loader={null} /> */}
      </Route>
    )
  );
  return (
    // <Suspense
    // fallback={
    //   <div className="center">
    //     <LoadingSpinner />
    //   </div>
    // }
    // >
    routes
    // </Suspense>
  );
}

export default RouteCreate;
