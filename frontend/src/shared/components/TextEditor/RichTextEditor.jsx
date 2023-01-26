import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RichUtils, getDefaultKeyBinding, convertToRaw } from "draft-js";

import Editor from "@draft-js-plugins/editor";

//Redux Slice
import { toolbarActions } from "../../../store/toolbar-slice";

//Custom Function
import { styleMap } from "../../util/style-map";
import plugins, { AlignmentTool } from "./Plugin";
import { getBlockStyle, getCustomStyleFn } from "./CustomStyleFn";
import { createLinkDecorator } from "./decorators/LinkDecorator";
import convertImgURL from "../../util/url-to-blob";

//Custom Component
import Button2 from "../Form/Button2";
import Backdrop from "../UI/Backdrop";
import ToolBar from "./ToolBar/ToolBar";
import ErrorModal from "../UI/Modal/ErrorModal";
import LoadingSpinner from "../UI/LoadingSpinner";

//Custom Hook
import useHttp from "../../hooks/http-hook";

//CSS
import "draft-js/dist/Draft.css";
import "./RichTextEditor.css";
import classes from "./RichTextEditor.module.css";

const decorator = createLinkDecorator();

function RichTextEditor(props) {
  const { editorState, onChange, className } = props;
  const editor = useRef(null);

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const { userId, isLoggedIn, avatar, token } = useSelector((state) => state.auth);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const dispatch = useDispatch();

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const focusEditorHandler = () => {
    editor.current.focus();
    dispatch(toolbarActions.closeAll());
  };

  const handleKeyCommandHandler = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommandHandler = (event) => {
    if (event.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        event,
        editorState,
        4 /* maxDepth */
      );

      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(event);
  };

  //Save the Post
  const savePostHandler = async () => {
    try {
      const currentContent = editorState.getCurrentContent();
      const rawData = JSON.stringify(convertToRaw(currentContent));
      const [imgBlobs, convertedData] = convertImgURL(rawData);
      const createSendForm = (imgArray, draftRawData) => {
        const formData = new FormData();
        formData.append("language", isEnglish ? "en" : "ch");
        formData.append("editorState", draftRawData);
        for (let i = 0; i < imgArray.length; i++) {
          formData.append("images", imgArray[i]);
        }
        return formData;
      };
      const sendForm = createSendForm(imgBlobs, convertedData);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/new`,
        "POST",
        sendForm,
        {
          Authorization: "Bearer " + token,
        }
      );
    } catch (err) {}
  };

  //Delete the Post
  const deletePostHandler = async () => {
    console.log("Click");
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <>
          <Backdrop />
          <div className={`${classes["loading-container"]}`}>
            <LoadingSpinner asOverlay />
          </div>
        </>
      )}
      <div
        className={`${classes["editor-wrapper"]} ${className} ${
          isDarkMode ? "editor-wrapper-dark" : "editor-wrapper-light"
        }`}
      >
        <ToolBar
          editorState={editorState}
          setEditorState={onChange}
          isDarkMode={isDarkMode}
        />
        <div className={"editor-container"} onClick={focusEditorHandler}>
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={onChange}
            decorators={[decorator]}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            customStyleFn={getCustomStyleFn}
            handleKeyCommand={handleKeyCommandHandler}
            keyBindingFn={mapKeyToEditorCommandHandler}
            placeholder="Tell a story..."
            spellCheck={true}
            plugins={plugins}
          />
        </div>
        <AlignmentTool />
      </div>
      <div className={`${classes["btn-container"]}`}>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={savePostHandler}
        >
          SAVE
        </Button2>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={deletePostHandler}
        >
          DELETE
        </Button2>
      </div>
    </>
  );
}

export default RichTextEditor;
//reference 1:https://draftjs.org/docs/quickstart-rich-styling
//reference 2:https://www.youtube.com/watch?v=t12a6z090AU
//reference 3:https://www.youtube.com/watch?v=0pPlbLyeclI
//reference 4:https://codepen.io/michael_cox/pen/KmQJbZ
//reference 5:https://stackoverflow.com/questions/65548792/how-to-upload-multiple-file-with-react-node-and-multer
