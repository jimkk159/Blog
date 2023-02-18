import { configureStore } from "@reduxjs/toolkit";

//Slice
import tagReducer from "./tag-slice";
import postReducer from "./post-slice";
import authReducer from "./auth-slice";
import topicReducer from "./topic-slice";
import themeReducer from "./theme-slice";
import toolbarReducer from "./toolbar-slice";
import languageReducer from "./language-slice";

const store = configureStore({
  reducer: {
    tag: tagReducer,
    topic: topicReducer,
    post: postReducer,
    auth: authReducer,
    theme: themeReducer,
    toolbar: toolbarReducer,
    language: languageReducer,
  },
});

export default store;
