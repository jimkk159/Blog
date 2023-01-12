import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EditorState } from "draft-js";

//Redux Slice
import { toolbarActions } from "../../store/toolbar-slice";

//Image
import cubesImage from "../../assets/img/cubes.png";

//Custom Function
import { createLinkDecorator } from "../../shared/components/TextEditor/decorators/LinkDecorator";
import { removeTargetInlineStyles } from "../../shared/components/TextEditor/ToolBar/StyleControls/RemoveControls";

//Custom Component
import Card from "../../shared/components/UI/Card";
import Footer from "../../shared/components/Footer/Footer";
import Navigation from "../../shared/components/Navigation/Navigation";
import RichTextEditor from "../../shared/components/TextEditor/RichTextEditor";

//CSS
import classes from "./EditPage.module.css";

function EditPage(props) {
  const decorator = createLinkDecorator();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );
  const dispatch = useDispatch();
  const isLinkModal = useSelector((state) => state.toolbar.isLinkModal);
  const isDarkMode = useSelector((state) => state.theme.value);

  const mouseDownHandler = () => {
    if (isLinkModal) {
      console.log("remove");
      setEditorState(removeTargetInlineStyles(editorState, ["FAKE_FOCUS"]));
    }
    dispatch(toolbarActions.closeAll());
  };

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
        <Card className="page" isDarkMode={isDarkMode}>
          <a href="https://www.google.com/">123</a>
          <h1 className={classes["select"]}>Edit Page</h1>
          <RichTextEditor editorState={editorState} onChange={setEditorState} />
        </Card>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default EditPage;
