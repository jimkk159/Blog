import { EditorState, RichUtils, Modifier } from "draft-js";

const InlineStyleControls = (props) => {
  const { editorState, onChange } = props;
  const currentStyle = props.editorState.getCurrentInlineStyle();

  const checkSubscript = (editorState, style) => {
    if (style === "SUPERSCRIPT" || style === "SUBSCRIPT") {
      const removeStyle = style === "SUBSCRIPT" ? "SUPERSCRIPT" : "SUBSCRIPT";
      const contentState = Modifier.removeInlineStyle(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        removeStyle
      );
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        "change-inline-style"
      );
      return newEditorState;
    }
    return editorState;
  };
  
  //Toggle Inline Style
  const toggleInlineStyleHandler = (inlineStyle) => {
    let newEditorState = editorState;
    newEditorState = checkSubscript(newEditorState, inlineStyle);
    onChange(RichUtils.toggleInlineStyle(newEditorState, inlineStyle));
  };

  return {
    activeStyleFn: (style) => currentStyle.has(style),
    toggleInlineStyleHandler,
  };
};

export default InlineStyleControls;
