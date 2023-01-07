import { EditorState, RichUtils, Modifier } from "draft-js";

const FontSizeControls = (props) => {
  const { editorState, onChange, fontSizeOptions } = props;

  //Toggle
  const toggleFontSizeHandler = (fontSizeStyle) => {
    const selection = editorState.getSelection();
    let newEditorState = editorState;

    //Remove prev FontSize style
    if (selection.isCollapsed()) {
      //If No Select anything than only modify the InlineStyleOverride
      newEditorState = EditorState.setInlineStyleOverride(editorState, null);
    } else {
      //Remove all the FontSize in the setting
      let contentState = editorState.getCurrentContent();
      fontSizeOptions.forEach((fontSize) => {
        contentState = Modifier.removeInlineStyle(
          contentState,
          editorState.getSelection(),
          `FONT_SIZE_${fontSize}`
        );
      });
      newEditorState = EditorState.push(
        editorState,
        contentState,
        "change-inline-style"
      );
    }

    //Set New FontSize
    if (onChange) {
      onChange(RichUtils.toggleInlineStyle(newEditorState, fontSizeStyle));
    }
  };

  //Create FontSize config
  const fontSizeChoicesCreator = (fontSize) => ({
    label: fontSize,
    style: `FONT_SIZE_${fontSize}`,
  });

  return {
    activeStyleFn: (style) => {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    },
    fontSizeChoicesCreator,
    toggleFontSizeHandler,
  };
};

export default FontSizeControls;
