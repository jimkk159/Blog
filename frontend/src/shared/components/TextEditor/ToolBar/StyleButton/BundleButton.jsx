import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { checkActive } from "./checkActive";

//Reducer Slice
import { toolbarActions } from "../../../../../store/toolbar-slice.js";

//Custom Component
import StyleButton from "./StyleButton";
import DropDown from "./DropDown/DropDown";
import LinkModal from "./Modal/LinkModal";

//CSS
import classes from "./BundleButton.module.css";

function BundleButton(props) {
  let content;

  //Redux
  const isLinkModal = useSelector((state) => state.toolbar.isLinkModal);
  const dispatch = useDispatch();

  const closeHandler = () => {
    dispatch(toolbarActions.closeLinkModal());
  };

  //Choice the button type
  if (props.opt === "colorPicker") {
    content = (
      <input
        key={props.opt}
        id="color-picker"
        className={classes["color-pciker"]}
        type="color"
        title={props.opt}
        onChange={props.onChange}
      />
    );
  } else if (props.config.inDropdown) {
    //dropdown bundle type
    content = (
      <DropDown
        key={props.opt}
        id={props.opt}
        width={props.width}
        title={props.opt}
        config={props.config}
        choicesCreator={props.choicesCreator}
        onChange={props.onChange}
        activeStyle={props.active}
        isDarkMode={props.isDarkMode}
      />
    );
  } else {
    //bundle the every single style button
    content = props.config.options.map((option) => {
      const opt = props.config.choices[option];

      return (
        <div key={opt.label} className={classes["item-container"]}>
          <StyleButton
            key={opt.label}
            id={option}
            opt={option}
            disable={props.disable}
            active={checkActive(opt.style, props.active)}
            label={opt.label}
            icon={opt.icon}
            style={opt.style}
            onChange={props.onChange}
            isDarkMode={props.isDarkMode}
          />
          {option === "link" && isLinkModal && (
            <LinkModal
              onClose={closeHandler}
              onAddLink={props.onAddLink}
              onForce={props.onForce}
            />
          )}
        </div>
      );
    });
  }

  return <div className={classes["container"]}>{content}</div>;
}

export default BundleButton;
