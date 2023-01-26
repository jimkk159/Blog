import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { EditorState } from "draft-js";

//Redux Slice
import { toolbarActions } from "../../store/toolbar-slice";

//Image
import cubesImage from "../../assets/img/cubes.png";

//Custom Function
import { removeTargetInlineStyles } from "../../shared/components/TextEditor/ToolBar/StyleControls/RemoveControls";

//Custom Component
import Footer from "../../shared/components/Footer/Footer";
import Navigation from "../../shared/components/Navigation/Navigation";
import RichTextEditor from "../../shared/components/TextEditor/RichTextEditor";

//CSS
import classes from "./EditPage.module.css";

function EditPage(props) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  //Redux
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.value);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isLinkModal = useSelector((state) => state.toolbar.isLinkModal);

  //React Router
  const navigate = useNavigate();

  const mouseDownHandler = () => {
    if (isLinkModal) {
      console.log("remove");
      setEditorState(removeTargetInlineStyles(editorState, ["FAKE_FOCUS"]));
    }
    dispatch(toolbarActions.closeAll());
  };

  useEffect(() => {
    if (!isLoggedIn) navigate(`/`);
  }, [isLoggedIn, navigate]);

  return (
    <div
      className={`${classes["blog-layout"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
      style={{ backgroundImage: `url(${cubesImage})` }}
      onMouseDown={mouseDownHandler}
    >
      <Navigation />
      <main>
        <RichTextEditor editorState={editorState} onChange={setEditorState} />
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default EditPage;
