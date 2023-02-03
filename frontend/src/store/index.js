import { configureStore } from "@reduxjs/toolkit";

//Slice
import authReducer from "./auth-slice";
import themeReducer from "./theme-slice";
import tagReducer from "./tag-slice";
import toolbarReducer from "./toolbar-slice";
import languageReducer from "./language-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    tag:tagReducer,
    toolbar: toolbarReducer,
    language: languageReducer,
  },
});

export default store;
