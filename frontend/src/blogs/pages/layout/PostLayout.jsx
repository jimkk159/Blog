import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//Redux Slice
import { toolbarActions } from "../../../store/toolbar-slice";

//Image
import cubesImage from "../../../assets/img/cubes.png";

//Custom Function
import { removeTargetInlineStyles } from "../../../shared/components/TextEditor/ToolBar/StyleControls/RemoveControls";

//Custom Component
import Footer from "../../../shared/components/Footer/Footer";
import Navigation from "../../../shared/components/Navigation/Navigation";

//CSS
import classes from "./PostLayout.module.css";

function PostLayout(props) {
  const [isEdit, setIsEdit] = useState(false);
  const [postEditorState, setPostEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [newPostEditorState, setNewPostEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  //Redux
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.value);
  const isLinkModal = useSelector((state) => state.toolbar.isLinkModal);

  const mouseDownHandler = () => {
    if (isLinkModal) {
      console.log("remove");
      setPostEditorState(removeTargetInlineStyles(postEditorState, ["FAKE_FOCUS"]));
      setNewPostEditorState(removeTargetInlineStyles(newPostEditorState, ["FAKE_FOCUS"]));
    }
    dispatch(toolbarActions.closeAll());
  };

  return (
    <div
      className={`${classes["blog-layout"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
      style={{ backgroundImage: `url(${cubesImage})` }}
      onMouseDown={isEdit ? mouseDownHandler : null}
    >
      <Navigation />
      <main>
        <Outlet
          context={{
            edit: [isEdit, setIsEdit],
            postState: [postEditorState, setPostEditorState],
            newPostState: [newPostEditorState, setNewPostEditorState],
          }}
        />
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default PostLayout;
