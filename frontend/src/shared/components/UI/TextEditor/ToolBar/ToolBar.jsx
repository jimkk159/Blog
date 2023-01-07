import React from "react";

//Custom Function
import { toolbar } from "./toolbar-setting";

//Custom Component
import BundleButton from "./StyleButton/BundleButton";
import IndentControls from "./StyleControls/IndentControls";
import HistoryControls from "./StyleControls/HistoryControls";
import FontSizeControls from "./StyleControls/FontSizeControls";
import RemoveStyleControls from "./StyleControls/RemoveControls";
import BlockStyleControls from "./StyleControls/BlockStyleControls";
import InlineStyleControls from "./StyleControls/InlineStyleControls";

//CSS
import classes from "./ToolBar.module.css";

function ToolBar(props) {
  const { editorState, setEditorState } = props;

  return (
    <div
      className={`${classes["container"]} ${
        props.isDarkMode
          ? classes["container-dark"]
          : classes["container-light"]
      } `}
    >
      {toolbar.options.map((opt, index) => {
        let active, choicesCreator, onButtonTrigger;
        const toolType = toolbar.features[opt].type;
        const config = toolbar.features[opt];

        switch (toolType) {
          case "blockType":
            const { activeStyle, toggleBlockTypeHandler } = BlockStyleControls({
              editorState,
              onChange: setEditorState,
            });
            active = activeStyle;
            onButtonTrigger = toggleBlockTypeHandler;
            break;

          case "inline":
            const { activeStyleFn: inlineActiveFn, toggleInlineStyleHandler } =
              InlineStyleControls({
                editorState,
                onChange: setEditorState,
              });
            active = inlineActiveFn;
            onButtonTrigger = toggleInlineStyleHandler;
            break;

          case "fontSize":
            const {
              activeStyleFn: fontSizeActiveFn,
              fontSizeChoicesCreator,
              toggleFontSizeHandler,
            } = FontSizeControls({
              fontSizeOptions: config.options,
              editorState,
              onChange: setEditorState,
            });
            active = fontSizeActiveFn;
            choicesCreator = fontSizeChoicesCreator;
            onButtonTrigger = toggleFontSizeHandler;
            break;

          case "indent":
            const { indentHandler, outdentHandler } = IndentControls({
              editorState,
              onChange: setEditorState,
            });
            onButtonTrigger = {
              indent: indentHandler,
              outdent: outdentHandler,
            };
            break;

          case "remove":
            const { removeAllInlineStylesHandler } = RemoveStyleControls({
              toolbar,
              editorState,
              onChange: setEditorState,
            });

            onButtonTrigger = removeAllInlineStylesHandler;
            break;

          case "history":
            const { undoHandler, redoHandler } = HistoryControls({
              editorState,
              onChange: setEditorState,
            });
            onButtonTrigger = { undo: undoHandler, redo: redoHandler };
            break;

          default:
            break;
        }
        if (!onButtonTrigger) return null;
        return (
          <BundleButton
            key={index}
            opt={opt}
            active={active}
            config={config}
            isDarkMode={props.isDarkMode}
            onChange={onButtonTrigger}
            choicesCreator={choicesCreator}
          />
        );
      })}
    </div>
  );
}

export default ToolBar;
//reference 4:https://www.youtube.com/watch?v=PuzqX5dxxKs
//reference 5:https://stackoverflow.com/questions/57213374/reactjs-and-draftjs-how-to-change-font-size-on-the-fly
