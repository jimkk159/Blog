import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  date: null,
  authorId: null,
  author: null,
  avatar: null,
  coverUrl: null,
  topicId: null,
  pin: false,
  tags: [],
  related: [],
  oriCoverUrl: null,
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
      state.related = action.payload.related;
      state.oriCoverUrl = action.payload.url;
      state.tags = action.payload.tags;
      state.oriTags = action.payload.tags;
    },
    setUrl: (state, action) => {
      state.coverUrl = action.payload.url;
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
      state.oriTags = state.tags;
    },
    cancel: (state) => {
      state.coverUrl = state.oriCoverUrl;
      state.tags = state.oriTags;
    },
    reset: () => initialState,
  },
});
export const postActions = postSlice.actions;

export default postSlice.reducer;
