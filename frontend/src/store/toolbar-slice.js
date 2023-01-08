import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  color: "#000000",
  currentTool: null,
};

const toolbarSlice = createSlice({
  name: "toolbar",
  initialState,
  reducers: {
    choice: (state, action) => {
      state.currentTool = action.payload.tool;
    },
    close: (state) => {
      state.currentTool = null;
    },
    changeColor:(state, action) => {
      state.color = action.payload.color;
    },
  },
});
export const toolbarActions = toolbarSlice.actions;

export default toolbarSlice.reducer;
