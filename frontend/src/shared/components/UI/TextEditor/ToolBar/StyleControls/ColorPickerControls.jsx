import { useState } from "react";
import { RichUtils, EditorState, Modifier } from "draft-js";

const ColorPickerControls = (props) => {
  const { editorState, onChange } = props;
  const [prevColor, setPrevColor] = useState("#000000");

  //Toggle Color
  const toggleColorHandler = (event) => {
    if (event.target.value !== prevColor) {
      const selection = editorState.getSelection();
      let newEditorState = editorState;

      //Remove prev Color
      if (selection.isCollapsed()) {
        //If No Select anything than only modify the InlineStyleOverride
        newEditorState = EditorState.setInlineStyleOverride(editorState, null);
      } else {
        //Remove all the Color in the setting
        let contentState = editorState.getCurrentContent();
        const colorStyles = editorState
          .getCurrentInlineStyle()
          .filter((style) => style.startsWith("COLOR_#"));
        colorStyles.forEach((colorStyle) => {
          contentState = Modifier.removeInlineStyle(
            contentState,
            editorState.getSelection(),
            colorStyle
          );
        });
        newEditorState = EditorState.push(
          editorState,
          contentState,
          "change-inline-style"
        );
      }

      //Set New Color
      if (onChange) {
        setPrevColor(event.target.value);
        onChange(
          RichUtils.toggleInlineStyle(
            newEditorState,
            `COLOR_${event.target.value}`
          )
        );
      }
    }
  };

  return { toggleColorHandler };
};

export default ColorPickerControls;
