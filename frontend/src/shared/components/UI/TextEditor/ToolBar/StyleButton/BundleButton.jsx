import React from "react";

//Custom Component
import StyleButton from "./StyleButton";
import DropDown from "./DropDown/DropDown";

//CSS
import classes from "./BundleButton.module.css";

//Judge the button active
const checkActive = (style, active) => {
  let isActive = style === active;
  if (typeof active === "function") {
    isActive = active(style);
  }
  return isActive;
};

function BundleButton(props) {
  let content;

  //Choice the button type
  if (props.config.inDropdown) {
    //dropdown bundle type
    content = (
      <>
        <DropDown
          key={props.opt}
          id={props.opt}
          title={props.opt}
          config={props.config}
          onChange={props.onChange}
          activeStyle={props.active}
          isDarkMode={props.isDarkMode}
        />
      </>
    );
  } else {
    //bundle the every single style button
    content = props.config.options.map((option) => {
      const opt = props.config.choices[option];
      return (
        <StyleButton
          key={opt.label}
          id={option}
          className={classes["item"]}
          opt={option}
          active={checkActive(opt.style, props.active)}
          label={opt.label}
          icon={opt.icon}
          style={opt.style}
          onChange={props.onChange}
          isDarkMode={props.isDarkMode}
        />
      );
    });
  }

  return <div className={classes["container"]}>{content}</div>;
}

export default BundleButton;
