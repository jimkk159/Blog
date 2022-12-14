import React from "react";
import { RouterProvider } from "react-router-dom";

//Context
import AuthContextProvider from "./shared/context/auth-contex";

//Route
import router from "./route/route";

//CSS
import "./App.module.css";

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
