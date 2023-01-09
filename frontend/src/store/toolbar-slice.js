import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  color: "#000000",
  currentTool: null,
  isLinkModal: false,
};

const toolbarSlice = createSlice({
  name: "toolbar",
  initialState,
  reducers: {
    choice: (state, action) => {
      state.currentTool = action.payload.tool;
      state.isLinkModal = false;
    },
    closeDrop: (state) => {
      state.currentTool = null;
    },
    toggleLinkModal: (state) => {
      state.currentTool = null;
      state.isLinkModal = !state.isLinkModal;
    },
    closeLinkModal: (state) => {
      state.isLinkModal = false;
    },
    closeAll: (state) => {
      state.currentTool = null;
      state.isLinkModal = false;
    },
    changeColor: (state, action) => {
      state.color = action.payload.color;
    },
  },
});
export const toolbarActions = toolbarSlice.actions;

export default toolbarSlice.reducer;
