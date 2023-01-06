import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTool:null,
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
  },
});
export const toolbarActions = toolbarSlice.actions;

export default toolbarSlice.reducer;
