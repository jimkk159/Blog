import { useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RichUtils, EditorState, getDefaultKeyBinding } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import { createEditorStateWithText } from "@draft-js-plugins/editor";

//Redux Slice
import { tagActions } from "../../store/tag-slice";
import { postActions } from "../../store/post-slice";
import { toolbarActions } from "../../store/toolbar-slice";

//Custom Function
import { options } from "../util/time";
import { styleMap } from "../../shared/util/style-map";
import plugins, {
  AlignmentTool,
  InlineToolbar,
} from "../../shared/components/TextEditor/Plugin";
import { createLinkDecorator } from "../../shared/components/TextEditor/decorators/LinkDecorator";
import {
  getBlockStyle,
  getCustomStyleFn,
} from "../../shared/components/TextEditor/CustomStyleFn";

//Custom Component
import PostTopic from "./PostTopic";
import TagsToolTip from "./TagsToolTip";
import ScrollToolOpen from "./ScrollToolOpen";
import ScrollToolClose from "./ScrollToolClose";
import Card from "../../shared/components/UI/Card";
import Tags from "../../shared/components/UI/Tags";
import PostDetailTitle from "./PostDetail/PostDetailTitle";
import UploadImage from "../../shared/components/Form/UploadImage";
import ToolBar from "../../shared/components/TextEditor/ToolBar/ToolBar";
import ScrollOpenClose from "../../shared/components/UI/ScrollOpenClose";

//CSS
import "draft-js/dist/Draft.css";
import "./PostEditor.css";
import classes from "./PostEditor.module.css";

const decorator = createLinkDecorator();
function PostEditor({
  className,
  shortState,
  titleState,
  editorState,
  tagState,
  onChangeShort,
  onChangeTitle,
  onChange,
  onChangeTag,
  onCover,
}) {
  const titleRef = useRef(null);
  const editorRef = useRef(null);
  const tagRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [collapse, setCollapse] = useState(false);

  //Redux
  const isTag = useSelector((state) => state.tag.isTag);
  const isDarkMode = useSelector((state) => state.theme.value);
  const language = useSelector((state) => state.language.language);
  const { oriCoverUrl, tags } = useSelector((state) => state.post);
  const { name: author, avatar } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  //React Router
  const location = useLocation();
  const initCollapse = location?.state?.collapse
    ? location.state.collapse
    : false;

  const titleContent = (
    <div>
      <Editor
        ref={titleRef}
        editorState={titleState}
        onChange={onChangeTitle}
        placeholder={language.addTitle}
        textAlignment="center"
      />
    </div>
  );

  //Add Tag
  const addTagHandler = (tag) => {
    if (!!tag) dispatch(postActions.addTag({ tag }));
  };

  //Focus Tag Editor
  const tagFocusHandler = () => {
    tagRef.current.focus();
    dispatch(tagActions.show());
  };

  //Search Handler
  const searchHandler = (target) => {
    setSearchItem(target);
    onChangeTag(createEditorStateWithText(target));
  };

  //Sync editor and input

  const editorTag = (
    <>
      <TagsToolTip
        className={`${classes["tool-tip-light"]}`}
        show={isTag}
        value={searchItem}
        isDarkMode={isDarkMode}
        onTag={addTagHandler}
        onSearch={searchHandler}
        isAnimate
      />
      <div onClick={tagFocusHandler}>
        <Editor
          ref={tagRef}
          editorState={tagState}
          onChange={onChangeTag}
          placeholder="+..."
        />
      </div>
    </>
  );

  //When Drag in trigger upload area
  const dragHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter") {
      setIsDrag(true);
    }
  };

  //ToDo add article reference
  const focusEditorHandler = () => {
    editorRef.current.focus();
    dispatch(toolbarActions.closeAll());
  };

  //Add Tag by type
  const addTypeTagHandler = (event) => {
    if (event.key === "Enter") {
      const currentContent = tagState.getCurrentContent();
      const contentBlock = currentContent.getFirstBlock();
      const tag = contentBlock.getText().trim();
      addTagHandler(tag);
      onChangeTag(() => EditorState.createEmpty());
    }
  };

  //Remove Tag
  const removeTagHandler = (tag) => dispatch(postActions.removeTag({ tag }));
  const coverUrlHandler = (url) => {
    dispatch(postActions.setUrl({ url }));
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

  useEffect(() => {
    const currentContent = tagState.getCurrentContent();
    const contentBlock = currentContent.getFirstBlock();
    const tag = contentBlock.getText();
    setSearchItem(tag);
  }, [tagState]);

  useEffect(() => {
    setCollapse(initCollapse);
  }, [initCollapse]);

  return (
    <div
      className={`${classes["editor-wrapper"]} ${className} ${
        isDarkMode ? "editor-wrapper-dark" : "editor-wrapper-light"
      }`}
    >
      <PostTopic
        collapse={collapse}
        isDarkMode={isDarkMode}
        onTag={addTagHandler}
        onRemove={removeTagHandler}
        onCollapse={setCollapse}
      />
      <ScrollOpenClose
        className={classes["position"]}
        openItem={
          <ScrollToolOpen
            editorState={editorState}
            onChange={onChange}
            isDarkMode={isDarkMode}
          />
        }
        closeItem={<ScrollToolClose />}
      />
      <Card className={`${classes["short-container"]}`} isDarkMode={isDarkMode}>
        <h1 className={classes["short-title"]}>{language["short-title"]}</h1>
        <hr className={classes["short-hr"]} />
        <Editor
          editorState={shortState}
          onChange={onChangeShort}
          placeholder={language.short}
        />
      </Card>
      <ToolBar
        isDarkMode={isDarkMode}
        editorState={editorState}
        onChange={onChange}
      />
      <Card
        className={`page ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        <PostDetailTitle
          title={titleContent}
          author={author}
          avatar={avatar}
          date={new Date().toLocaleDateString("en-US", options)}
          isDarkMode={isDarkMode}
          isNew
        />
        <div onDragEnter={dragHandler}>
          <UploadImage
            className={classes["cover"]}
            initImage={oriCoverUrl}
            ratioClassName={classes["cover-ratio"]}
            isDarkMode={isDarkMode}
            isDrag={isDrag}
            placeholder={"+"}
            onDrag={setIsDrag}
            onUpdate={onCover}
            onPreview={coverUrlHandler}
          />
        </div>
        <div className={classes["editor-container"]}>
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={onChange}
            decorators={[decorator]}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            customStyleFn={getCustomStyleFn}
            handleKeyCommand={handleKeyCommandHandler}
            keyBindingFn={mapKeyToEditorCommandHandler}
            placeholder={language.addContent}
            spellCheck={true}
            plugins={plugins}
            onClick={focusEditorHandler}
          />
        </div>
        <div className={classes["tags-container"]}>
          <Tags
            isEdit
            isDarkMode={isDarkMode}
            content={tags}
            onRemove={removeTagHandler}
            onKeyDown={addTypeTagHandler}
            editContent={editorTag}
          />
        </div>
        <InlineToolbar />
      </Card>
      <AlignmentTool />
    </div>
  );
}

export default PostEditor;
//reference 1:https://draftjs.org/docs/quickstart-rich-styling
//reference 2:https://www.youtube.com/watch?v=t12a6z090AU
//reference 3:https://www.youtube.com/watch?v=0pPlbLyeclI
//reference 4:https://codepen.io/michael_cox/pen/KmQJbZ
//reference 5:https://stackoverflow.com/questions/65548792/how-to-upload-multiple-file-with-react-node-and-multer
