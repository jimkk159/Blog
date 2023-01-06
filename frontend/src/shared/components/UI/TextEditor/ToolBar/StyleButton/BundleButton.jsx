import React from "react";

//Custom Component
import StyleButton from "./StyleButton";
import DropDown from "./DropDown/DropDown";
// import DropDownButton from "./DropDownButton";

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
        {/* <DropDownButton
          id={props.id}
          config={props.config}
          onToggle={props.onToggle}
          isDarkMode={props.isDarkMode}
        /> */}
        <DropDown
          key={props.id}
          id={props.id}
          title={props.title}
          config={props.config}
          onToggle={props.onToggle}
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
          id={props.id}
          className={classes["item"]}
          active={checkActive(opt.style, props.active)}
          label={opt.label}
          icon={opt.icon}
          style={opt.style}
          onToggle={props.onToggle}
          isDarkMode={props.isDarkMode}
        />
      );
    });
  }
  return <div className={classes["container"]}>{content}</div>;
}

export default BundleButton;
