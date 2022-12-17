import React from "react";
import { RouterProvider } from "react-router-dom";

//Context
import AuthContextProvider from "./shared/context/auth-context";

//Route
import RouteCreate from "./route/route";
import ThemeContextProvider from "./shared/context/theme-context";

//CSS
// import classes from "./App.module.css";

function App() {
  const router = RouteCreate();
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export default App;
