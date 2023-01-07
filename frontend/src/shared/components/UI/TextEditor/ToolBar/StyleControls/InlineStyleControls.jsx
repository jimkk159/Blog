import { RichUtils } from "draft-js";

const InlineStyleControls = (props) => {
  const { editorState, onChange } = props;
  const currentStyle = props.editorState.getCurrentInlineStyle();

  //Toggle Inline Style
  const toggleInlineStyleHandler = (inlineStyle) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  return {
    activeStyleFn: (style) => currentStyle.has(style),
    toggleInlineStyleHandler,
  };
};

export default InlineStyleControls;
