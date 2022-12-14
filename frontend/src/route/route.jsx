import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

//PAGE
import RootLayout from "../shared/pages/layouts/RootLayout";
import BlogLayout from "../shared/pages/layouts/RootLayout";
import HomePage from "../shared/pages/HomePage";
import AboutPage from "../shared/pages/AboutPage";
import ErrorPage from "../shared/pages/ErrorPage";
import AuthPage from "../users/pages/AuthPage";
import NewPostPage from "../blogs/pages/NewPostPage";
import PostPage from "../blogs/pages/PostPage";
import PostsPage from "../blogs/pages/PostsPage";

//Custom Hook
import useMediaQuery from "../shared/hooks/media-query-hook";

function RouteCreate() {
  const { matches } = useMediaQuery("min", "768");

  return createBrowserRouter(
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
        <Route path="/*" element={<Navigate replace to="/" />} loader={null} />
      </Route>
    )
  );
}

export default RouteCreate;
