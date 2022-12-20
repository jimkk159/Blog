import { configureStore } from "@reduxjs/toolkit";

//Slice
import authReducer from "./auth-slice";
import themeReducer from "./theme-slice";
import languageReducer from "./lauguage-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    language: languageReducer,
  },
});

export default store;
