import React from "react";
import {
  Route,
  Navigate,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

//CSS
import "./APP.module.css";

//PAGE
import RootLayout from "./pages/layouts/RootLayout";
import BlogLayout from "./pages/layouts/RootLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ErrorPage from "./pages/ErrorPage";
import AuthPage from "./pages/AuthPage";
import NewPostPage from "./pages/NewPostPage";
import PostPage from "./pages/PostPage";
import PostsPage from "./pages/PostsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} loader={null} />
      <Route path="/blog" element={<BlogLayout />} loader={null}>
        <Route index element={<PostsPage />} loader={null} />
        <Route index path="new-blog" element={<NewPostPage />} loader={null} />
        <Route path=":blogId" element={<PostPage />} loader={null} />
      </Route>
      <Route path="/about" element={<AboutPage />} loader={null} />
      <Route path="/auth" element={<AuthPage />} loader={null} />
      <Route path="/*" element={<Navigate replace to="/" />} loader={null} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
