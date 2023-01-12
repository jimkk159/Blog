import { useSelector, useDispatch } from "react-redux";
import { RichUtils } from "draft-js";

//Custom Function
import { removePrevStyle } from "./RemoveControls";

//Redux Slice
import { toolbarActions } from "../../../../../store/toolbar-slice";

const ColorPickerControls = (props) => {
  const { editorState, onChange } = props;

  //Redux
  const color = useSelector((state) => state.toolbar.color);
  const dispatch = useDispatch();

  //Toggle Color
  const toggleColorHandler = (event) => {
    if (event.target.value !== color) {
      const colorStyles = editorState
        .getCurrentInlineStyle()
        .filter((style) => style.startsWith("COLOR_#"));
      const createColorStyle = (style) => style;
      let newEditorState = removePrevStyle(
        editorState,
        colorStyles,
        createColorStyle
      );

      //Set New Color
      if (onChange) {
        dispatch(toolbarActions.changeColor({ color: event.target.value }));
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
