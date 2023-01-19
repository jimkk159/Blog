//Custom Block Function
export const getBlockStyle = (block) => {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    case "ALIGN_RIGHT":
      return "ALIGN_RIGHT";
    case "ALIGN_CENTER":
      return "ALIGN_CENTER";
    case "ALIGN_LEFT":
      return "ALIGN_LEFT";
    case "ALIGN_JUSTIFY":
      return "ALIGN_JUSTIFY";
    default:
      return null;
  }
}

//Custom inlineStyle Function
const CUSTOM_STYLE_PREFIX_COLOR = "COLOR_";
const CUSTOM_STYLE_PREFIX_FONT_SIZE = "FONT_SIZE_";
export const getCustomStyleFn = (style) => {
  const styleNames = style.toJS();
  return styleNames.reduce((styles, styleName) => {
    if (styleName.startsWith(CUSTOM_STYLE_PREFIX_COLOR)) {
      styles.color = `${styleName.split(CUSTOM_STYLE_PREFIX_COLOR)[1]}`;
    }
    if (styleName.startsWith(CUSTOM_STYLE_PREFIX_FONT_SIZE)) {
      styles.fontSize = `${
        styleName.split(CUSTOM_STYLE_PREFIX_FONT_SIZE)[1]
      }px`;
    }
    return styles;
  }, {});
}
