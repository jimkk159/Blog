import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  topics: [],
  topic: "",
  parent: "",
  children: [],
  cover: null,
  oriTopic: "",
  oriParent: "",
  oriChildren: [],
  oriCover: null,
};

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setTopics: (state, action) => {
      state.topics = action.payload.topics;
    },
    setInit: (state, action) => {
      state.id = action.payload.id;
      if (action.payload.topic) {
        state.topic = action.payload.topic;
        state.oriTopic = action.payload.oriTopic;
      }
      if (action.payload.parent) {
        state.parent = action.payload.parent;
        state.oriParent = action.payload.parent;
      }
      if (action.payload.children) {
        state.children = action.payload.children;
        state.oriChildren = action.payload.children;
      }
      if (action.payload.cover) {
        state.cover = action.payload.cover;
        state.cover = action.payload.oriCover;
      }
    },
    setTopic: (state, action) => {
      if (action.payload.topic) state.topic = action.payload.topic;
      if (action.payload.parent) state.parent = action.payload.parent;
      if (action.payload.children) state.children = action.payload.children;
    },
    resetTopic: (state) => {
      state.topic = null;
      state.parent = null;
      state.children = [];
    },
    reseRelation: (state) => {
      state.parent = null;
      state.children = [];
    },
    save: (state) => {
      state.oriTopic = state.topic;
      state.oriParent = state.parent;
      state.oriChildren = state.children;
    },
    cancel: (state) => {
      state.topic = state.oriTopic;
      state.parent = state.oriParent;
      state.children = state.oriChildren;
    },
    reset: () => initialState,
  },
});
export const topicActions = topicSlice.actions;

export default topicSlice.reducer;
