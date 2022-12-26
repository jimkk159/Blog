import React from "react";
import { Provider } from "react-redux";

//Redux Store
import store from "./store/index.js";

//Custom Component
import CustomRoute from "./routes/routes";

//CSS
// import classes from "./App.module.css";

function App() {
  return (
    <Provider store={store}>
      <CustomRoute />
    </Provider>
  );
}

export default App;

//reference https://stackoverflow.com/questions/72515460/react-redux-could-not-find-react-redux-context-value-please-ensure-the-componen
