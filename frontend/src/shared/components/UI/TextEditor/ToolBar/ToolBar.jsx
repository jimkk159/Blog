import React from "react";
import { EditorState, RichUtils, Modifier } from "draft-js";

import { toolbar } from "./toolbar-setting";

//Custom Component
import IndentControls from "./IndentControls";
import RemoveControls from "./RemoveControls";
import BlockStyleControls from "./StyleControls/BlockStyleControls";
import InlineStyleControls from "./StyleControls/InlineStyleControls";

//CSS
import classes from "./ToolBar.module.css";

function ToolBar(props) {
  const { editorState, setEditorState } = props;

  //History
  const undoHandler = () => {
    setEditorState(EditorState.undo(editorState));
  };
  // const redoHandler = () => {
  //   setEditorState(EditorState.redo(editorState));
  // };

  //Indent
  // const adjustDepth = () => {};
  const indentHandler = () => {
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockKey = block.getKey();
    const depth = block.getDepth();
    const newBlock = block.set("depth", depth + 1);
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();
    const newBlockMap = blockMap.set(blockKey, newBlock);
    setEditorState(
      EditorState.push(
        editorState,
        contentState.merge({ blockMap: newBlockMap }),
        "adjust-depth"
      )
    );
  };

  //Remove InlineStyle
  const removeAllInlineStyles = (editorState) => {
    let contentState = editorState.getCurrentContent();
    toolbar.options.forEach((option) => {
      const feature = toolbar.features[option];
      if (feature.type === "inline") {
        feature.options.forEach((option) => {
          contentState = Modifier.removeInlineStyle(
            contentState,
            editorState.getSelection(),
            feature.choices[option].style
          );
        });
      }
    });
    return EditorState.push(editorState, contentState, "change-inline-style");
  };

  const removeInlineStylesHandler = () => {
    setEditorState(removeAllInlineStyles(editorState));
  };

  //Toggle Block Type
  const toggleBlockTypeHandler = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  //Toggle Inline Style
  const toggleInlineStyleHandler = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  return (
    <div
      className={`${classes["container"]} ${
        props.isDarkMode
          ? classes["container-dark"]
          : classes["container-light"]
      } `}
    >
      {toolbar.options.map((opt, index) => {
        const config = toolbar.features[opt];
        if (toolbar.features[opt].type === "history")
          return (
            <IndentControls
              key={index}
              id={opt}
              title={opt}
              config={config}
              editorState={editorState}
              onToggle={undoHandler}
              isDarkMode={props.isDarkMode}
            />
          );
        if (toolbar.features[opt].type === "indent")
          return (
            <IndentControls
              key={index}
              id={opt}
              title={opt}
              config={config}
              editorState={editorState}
              onToggle={indentHandler}
              isDarkMode={props.isDarkMode}
            />
          );
        if (toolbar.features[opt].type === "remove")
          return (
            <RemoveControls
              key={index}
              id={opt}
              title={opt}
              config={config}
              editorState={editorState}
              onToggle={removeInlineStylesHandler}
              isDarkMode={props.isDarkMode}
            />
          );
        if (toolbar.features[opt].type === "blockType")
          return (
            <BlockStyleControls
              key={index}
              id={opt}
              title={opt}
              config={config}
              editorState={editorState}
              onToggle={toggleBlockTypeHandler}
              isDarkMode={props.isDarkMode}
            />
          );
        return (
          <InlineStyleControls
            key={index}
            id={opt}
            title={opt}
            config={config}
            editorState={editorState}
            onToggle={toggleInlineStyleHandler}
            isDarkMode={props.isDarkMode}
          />
        );
      })}
    </div>
  );
}

export default ToolBar;
//reference 4:https://www.youtube.com/watch?v=PuzqX5dxxKs
//reference 5:https://stackoverflow.com/questions/57213374/reactjs-and-draftjs-how-to-change-font-size-on-the-fly
