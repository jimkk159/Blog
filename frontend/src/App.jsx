import React from "react";
import { Provider } from 'react-redux'
import { RouterProvider } from "react-router-dom";

//Context
import AuthContextProvider from "./shared/context/auth-context";
import LanguageContextProvider from "./shared/context/language-context";

//Redux Store
import store from "./store/index.js";

//Route
import RouteCreate from "./route/route";

//CSS
// import classes from "./App.module.css";

function App() {
  const router = RouteCreate();
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <LanguageContextProvider>
            <RouterProvider router={router} />
        </LanguageContextProvider>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;
