import React from "react";
import { RouterProvider } from "react-router-dom";

//Context
import AuthContextProvider from "./shared/context/auth-context";
import ThemeContextProvider from "./shared/context/theme-context";
import LanguageContextProvider from "./shared/context/language-context";

//Route
import RouteCreate from "./route/route";

//CSS
// import classes from "./App.module.css";

function App() {
  const router = RouteCreate();
  return (
    <AuthContextProvider>
      <LanguageContextProvider>
        <ThemeContextProvider>
          <RouterProvider router={router} />
        </ThemeContextProvider>
      </LanguageContextProvider>
    </AuthContextProvider>
  );
}

export default App;
