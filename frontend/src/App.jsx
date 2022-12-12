import React from "react";
import {
  Route,
  Navigate,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

//CSS
import "./App.module.css";

//Context
import AuthContextProvider from "./shared/context/auth-contex";

//PAGE
import RootLayout from "./shared/pages/layouts/RootLayout";
import BlogLayout from "./shared/pages/layouts/RootLayout";
import HomePage from "./shared/pages/HomePage";
import AboutPage from "./shared/pages/AboutPage";
import ErrorPage from "./shared/pages/ErrorPage";
import AuthModal from "./users/components/AuthModal";
import NewPostPage from "./blogs/pages/NewPostPage";
import PostPage from "./blogs/pages/PostPage";
import PostsPage from "./blogs/pages/PostsPage";


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
      <Route path="/auth" element={<AuthModal />} loader={null} />
      <Route path="/*" element={<Navigate replace to="/" />} loader={null} />
    </Route>
  )
);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
