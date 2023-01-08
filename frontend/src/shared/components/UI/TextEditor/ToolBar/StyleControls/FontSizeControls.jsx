import { RichUtils } from "draft-js";

//Custom Function
import { removePrevStyle } from "./RemoveControls";

const FontSizeControls = (props) => {
  const { editorState, onChange, fontSizeOptions } = props;

  //Toggle
  const toggleFontSizeHandler = (fontSizeStyle) => {
    const createFontSizetStyle = (fontSize) => `FONT_SIZE_${fontSize}`;
    let newEditorState = removePrevStyle(
      editorState,
      fontSizeOptions,
      createFontSizetStyle
    );

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
