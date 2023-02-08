import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  RichUtils,
  EditorState,
  ContentState,
  getDefaultKeyBinding,
} from "draft-js";
import Editor from "@draft-js-plugins/editor";

//Redux Slice
import { tagActions } from "../../store/tag-slice";
import { toolbarActions } from "../../store/toolbar-slice";

//Custom Function
import { styleMap } from "../../shared/util/style-map";
import plugins, {
  AlignmentTool,
} from "../../shared/components/TextEditor/Plugin";
import { createLinkDecorator } from "../../shared/components/TextEditor/decorators/LinkDecorator";
import {
  getBlockStyle,
  getCustomStyleFn,
} from "../../shared/components/TextEditor/CustomStyleFn";

//Custom Component
import PostTopic from "./PostTopic";
import TagsToolTip from "./TagsToolTip";
import Card from "../../shared/components/UI/Card";
import Tags from "../../shared/components/UI/Tags";
import ToolBar from "../../shared/components/TextEditor/ToolBar/ToolBar";
import UploadImage from "../../shared/components/Form/UploadImage";
import PostDetailTitle from "./PostDetail/PostDetailTitle";

//CSS
import "draft-js/dist/Draft.css";
import "./PostEditor.css";
import classes from "./PostEditor.module.css";

const decorator = createLinkDecorator();
const options = { year: "numeric", month: "short", day: "numeric" };

function PostEditor({
  className,
  tags,
  topic,
  topics,
  topicTags,
  titleState,
  editorState,
  tagsState,
  onTags,
  onTopic,
  onChangeTitle,
  onChange,
  onChangeTags,
  onCover,
}) {
  const editorRef = useRef(null);
  const tagRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  //Redux
  const isTag = useSelector((state) => state.tag.isTag);
  const isDarkMode = useSelector((state) => state.theme.value);
  const { name: authorName, avatar: authorAvatar } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const titleContent = (
    <Editor
      editorState={titleState}
      onChange={onChangeTitle}
      placeholder="Click to add Title..."
      textAlignment="center"
    />
  );

  //Add Tag
  const addTagHandler = (tag) => {
    if (!!tag) {
      onTags((prev) => [...prev, tag]);
    }
  };

  //Focus Tag Editor
  const tagFocusHandler = () => {
    tagRef.current.focus();
    dispatch(tagActions.show());
  };

  //Search Handler
  const searchHandler = (target) => {
    setSearchItem(target);
    onChangeTags(
      EditorState.createWithContent(ContentState.createFromText(target))
    );
  };

  //Sync editor and input
  useEffect(() => {
    const currentContent = tagsState.getCurrentContent();
    const contentBlock = currentContent.getFirstBlock();
    const tag = contentBlock.getText();
    setSearchItem(tag);
  }, [tagsState]);

  const editorTag = (
    <>
      <TagsToolTip
        className={`${classes["tool-tip-light"]}`}
        show={isTag}
        value={searchItem}
        topicTags={topicTags}
        tags={tags}
        isAnimate
        isDarkMode={isDarkMode}
        onTag={addTagHandler}
        onSearch={searchHandler}
      />
      <div onClick={tagFocusHandler}>
        <Editor
          ref={tagRef}
          editorState={tagsState}
          onChange={onChangeTags}
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
      const currentContent = tagsState.getCurrentContent();
      const contentBlock = currentContent.getFirstBlock();
      const tag = contentBlock.getText().trim();
      addTagHandler(tag);
      onChangeTags(() => EditorState.createEmpty());
    }
  };

  //Remove Tag
  const removeTagHandler = (targetTag) => {
    onTags(tags.filter((tag) => tag !== targetTag));
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

  return (
    <div
      className={`${classes["editor-wrapper"]} ${className} ${
        isDarkMode ? "editor-wrapper-dark" : "editor-wrapper-light"
      }`}
    >
      <PostTopic
        topic={topic}
        topics={topics}
        topicTags={topicTags}
        isDarkMode={isDarkMode}
        onChange={onTopic}
        onTag={addTagHandler}
        onRemove={removeTagHandler}
      />
      <ToolBar
        editorState={editorState}
        setEditorState={onChange}
        isDarkMode={isDarkMode}
      />
      <Card
        className={`page ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        <PostDetailTitle
          title={titleContent}
          authorName={authorName}
          authorAvatar={authorAvatar}
          date={new Date().toLocaleDateString("en-US", options)}
          isDarkMode={isDarkMode}
          isNew
        />
        <div onDragEnter={dragHandler}>
          <UploadImage
            className={classes["cover"]}
            ratioClassName={classes["cover-ratio"]}
            isDarkMode={isDarkMode}
            isDrag={isDrag}
            placeholder={"+"}
            onDrag={setIsDrag}
            onUpdate={onCover}
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
            placeholder="Tell a story..."
            spellCheck={true}
            plugins={plugins}
            onClick={focusEditorHandler}
          />
        </div>
        <div className={classes["tags-container"]}>
          <Tags
            isEdit
            isDarkMode={isDarkMode}
            content={[...tags, editorTag]}
            onRemove={removeTagHandler}
            onKeyDown={addTypeTagHandler}
          />
        </div>
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
