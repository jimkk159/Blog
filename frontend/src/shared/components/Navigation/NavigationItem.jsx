import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

//Custom Component
import Icon from "../Icons/Icon";

//CSS
import classes from "./NavigationItem.module.css";

/**
 * Naviagtion Bar Item
 * @param show show the Item or not.
 * @param type the Item type e.g. button, anchor.
 * @param to the Item redirect link.
 * @param navInitialState initial state pass to the NavLink
 * @param onClick if the type is button, onClick will triger when the button been clcik
 * @param content if exist the input content will be content, otherwise it will be children
 */
function NavigationItem(props) {
  const inputContent = props.content ? props.content : props.children;

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  // Show Item or not
  if (props.show === false) {
    return;
  }

  // Type Button
  if (props.type === "button") {
    return (
      <div
        className={`${props.className} ${classes["nav-link"]} ${
          isDarkMode
            ? classes["nav-link-dark"]
            : classes["nav-link-light"]
        }`}
      >
        <Icon
          icon={props.icon}
          className={`${classes["nav-icon"]} ${props.iconClassName} `}
        />
        <button onClick={props.onClick} onBlur={props.onBlur}>
          {inputContent}
        </button>
      </div>
    );
  }

  // Type Button
  if (props.type === "li-button") {
    return (
      <li
        className={`${props.className} ${classes["nav-link"]} ${
          isDarkMode
            ? classes["nav-link-dark"]
            : classes["nav-link-light"]
        }`}
      >
        <Icon
          icon={props.icon}
          className={`${classes["nav-icon"]} ${props.iconClassName} `}
        />
        <button onClick={props.onClick} onBlur={props.onBlur}>
          {inputContent}
        </button>
      </li>
    );
  }

  //Normal Link
  if (props.type === "link") {
    return (
      <div
        className={`${props.className} ${classes["nav-link"]} ${
          isDarkMode
            ? classes["nav-link-dark"]
            : classes["nav-link-light"]
        }`}
        onClick={props.onClick}
      >
        <Icon
          icon={props.icon}
          className={`${classes["nav-icon"]} ${props.iconClassName} `}
        />
        <NavLink
          to={props.to}
          state={props.navInitialState}
          className={({ isActive }) => (isActive ? classes.active : null)}
        >
          {inputContent}
        </NavLink>
      </div>
    );
  }

  //Default Type Anchor
  return (
    <li
      className={`${classes["nav-link"]} ${props.className} ${
        isDarkMode ? classes["nav-link-dark"] : classes["nav-link-light"]
      }`}
      onClick={props.onClick}
    >
      <Icon
        icon={props.icon}
        className={`${classes["nav-icon"]} ${props.iconClassName} `}
      />
      <NavLink
        to={props.to}
        state={props.navInitialState}
        className={({ isActive }) => (isActive ? classes.active : null)}
      >
        {inputContent}
      </NavLink>
    </li>
  );
}

export default NavigationItem;
