import React from "react";
import { NavLink } from "react-router-dom";

//Custom Component
import NavIcon from "./NavIcon";

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
  // Show Item or not
  if (props.show === false) {
    return;
  }

  // Type Button
  if (props.type === "button") {
    return (
      <div
        className={`${props.className} ${classes["nav-link"]} ${
          props.isDarkMode
            ? classes["nav-link-dark"]
            : classes["nav-link-light"]
        }`}
      >
        <NavIcon
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
          props.isDarkMode
            ? classes["nav-link-dark"]
            : classes["nav-link-light"]
        }`}
      >
        <NavIcon
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
          props.isDarkMode
            ? classes["nav-link-dark"]
            : classes["nav-link-light"]
        }`}
        onClick={props.onClick}
      >
        <NavIcon
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
        props.isDarkMode ? classes["nav-link-dark"] : classes["nav-link-light"]
      }`}
      onClick={props.onClick}
    >
      <NavIcon
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
