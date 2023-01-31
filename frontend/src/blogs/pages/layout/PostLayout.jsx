import React, { useEffect, useState } from "react";
import { EditorState } from "draft-js";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//Redux Slice
import { toolbarActions } from "../../../store/toolbar-slice";

//Image
import cubesImage from "../../../assets/img/cubes.png";

//Custom Component
import Footer from "../../../shared/components/Footer/Footer";
import Navigation from "../../../shared/components/Navigation/Navigation";

//CSS
import classes from "./PostLayout.module.css";

function PostLayout() {
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

  //React Router
  const location = useLocation();
  const initIsEdit = location?.state?.isEdit ? location.state.isEdit : false;

  //Todo use forselection
  const mouseDownHandler = () => {
    dispatch(toolbarActions.closeAll());
  };

  useEffect(() => {
    setIsEdit(initIsEdit);
  }, [initIsEdit]);

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
