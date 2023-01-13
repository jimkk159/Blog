import React from "react";

//Custom Component
import BundleButton from "./StyleButton/BundleButton";
import LinkControls from "./StyleControls/LinkControls";
import ImageControls from "./StyleControls/ImageControls";
import IndentControls from "./StyleControls/IndentControls";
import HistoryControls from "./StyleControls/HistoryControls";
import FontSizeControls from "./StyleControls/FontSizeControls";
import RemoveStyleControls from "./StyleControls/RemoveControls";
import BlockStyleControls from "./StyleControls/BlockStyleControls";
import ColorPickerControls from "./StyleControls/ColorPickerControls";
import InlineStyleControls from "./StyleControls/InlineStyleControls";

//CSS
import classes from "./ToolBarBundle.module.css";

function ToolBarBundle(props) {
  const { className, toolbar, options, editorState, onChange } = props;

  return (
    <div className={`${className} ${classes["line-container"]}`}>
      {options.map((opt, index) => {
        let active, disable, width, choicesCreator, onAddLink, onButtonTrigger;
        const toolType = toolbar.features[opt].type;
        const config = toolbar.features[opt];

        switch (toolType) {
          case "blockType":
            const { activeStyle, toggleBlockTypeHandler } = BlockStyleControls({
              editorState,
              onChange,
            });
            active = activeStyle;
            width = 90;
            onButtonTrigger = toggleBlockTypeHandler;
            break;

          case "inline":
            const { activeStyleFn: inlineActiveFn, toggleInlineStyleHandler } =
              InlineStyleControls({
                editorState,
                onChange,
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
              onChange,
            });
            active = fontSizeActiveFn;
            width = 60;
            choicesCreator = fontSizeChoicesCreator;
            onButtonTrigger = toggleFontSizeHandler;
            break;

          case "indent":
            const { isDisabled, indentHandler, outdentHandler } =
              IndentControls({
                editorState,
                onChange,
              });
            disable = isDisabled;
            onButtonTrigger = {
              indent: indentHandler,
              outdent: outdentHandler,
            };
            break;

          case "remove":
            const { removeAllInlineStylesHandler } = RemoveStyleControls({
              toolbar,
              editorState,
              onChange,
            });

            onButtonTrigger = removeAllInlineStylesHandler;
            break;

          case "link":
            const { toggleLinkModalHandler, addLinkHandler, unlinkHandler } =
              LinkControls({
                editorState,
                onChange,
              });
            onAddLink = addLinkHandler;
            onButtonTrigger = {
              link: toggleLinkModalHandler,
              unlink: unlinkHandler,
            };
            break;

          case "color-picker":
            const { toggleColorHandler } = ColorPickerControls({
              editorState,
              onChange,
            });

            onButtonTrigger = toggleColorHandler;
            break;

          case "image":
            const { addImageHandler } = ImageControls({
              editorState,
              onChange,
            });
            onButtonTrigger = addImageHandler;
            break;

          case "history":
            const { undoHandler, redoHandler } = HistoryControls({
              editorState,
              onChange,
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
            width={width}
            active={active}
            disable={disable}
            config={config}
            isDarkMode={props.isDarkMode}
            choicesCreator={choicesCreator}
            onAddLink={onAddLink}
            onChange={onButtonTrigger}
          />
        );
      })}
    </div>
  );
}

export default ToolBarBundle;
