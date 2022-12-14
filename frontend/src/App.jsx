import React from "react";
import { RouterProvider } from "react-router-dom";

//Context
import AuthContextProvider from "./shared/context/auth-contex";

//Route
import RouteCreate from "./route/route";

//CSS
import "./App.module.css";

function App() {
  const router = RouteCreate();
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
