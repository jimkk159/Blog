import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  date: null,
  authorId: null,
  author: null,
  avatar: null,
  coverUrl: null,
  topic: "",
  topicCover: null,
  topicId: null,
  parent: "",
  children: [],
  pin: false,
  tags: [],
  oriCoverUrl: null,
  oriTopic: "",
  oriParent: "",
  oriChildren: [],
  oriTags: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setInit: (state, action) => {
      state.id = action.payload.id;
      state.date = action.payload.date;
      state.authorId = action.payload.authorId;
      state.author = action.payload.author;
      state.avatar = action.payload.avatar;
      state.pin = !!action.payload.pin;
      state.topicId = action.payload.topicId;
      state.coverUrl = action.payload.url;
      state.oriCoverUrl = action.payload.url;
      state.tags = action.payload.tags;
      state.oriTags = action.payload.tags;
    },
    setUrl: (state, action) => {
      state.coverUrl = action.payload.url;
    },
    setInitTopic: (state, action) => {
      if (action.payload.topic) {
        state.topic = action.payload.topic;
        state.oriTopic = action.payload.topic;
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
        state.topicCover = action.payload.cover;
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
    setTags: (state, action) => {
      state.tags = action.payload.tags;
    },
    addTag: (state, action) => {
      state.tags = [...state.tags, action.payload.tag];
    },
    removeTag: (state, action) => {
      state.tags = state.tags.filter((tag) => tag !== action.payload.tag);
    },
    save: (state) => {
      state.oriCoverUrl = state.coverUrl;
      state.oriTopic = state.topic;
      state.oriParent = state.parent;
      state.oriChildren = state.children;
      state.oriTags = state.tags;
    },
    cancel: (state) => {
      state.coverUrl = state.oriCoverUrl;
      state.topic = state.oriTopic;
      state.parent = state.oriParent;
      state.children = state.oriChildren;
      state.tags = state.oriTags;
    },
    reset: () => initialState,
  },
});
export const postActions = postSlice.actions;

export default postSlice.reducer;
