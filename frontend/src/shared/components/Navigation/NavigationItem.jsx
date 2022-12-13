// import { NavLink } from "react-router-dom";

//CSS
import { NavLink } from "react-router-dom";

//Custom Component
import classes from "./NavigationItem.module.css";

/**
 * Naviagtion Bar Item
 * @param show show the Item or not.
 * @param type the Item type e.g. button, anchor.
 * @param to the Item redirect link.
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
      <li className={`${classes["nav-link"]} ${props.className}`}>
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
        className={`${props.className} ${classes["nav-link"]} `}
        onClick={props.onClick}
      >
        <NavLink
          to={props.to}
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
      className={`${classes["nav-link"]} ${props.className}`}
      onClick={props.onClick}
    >
      <NavLink
        to={props.to}
        className={({ isActive }) => (isActive ? classes.active : null)}
      >
        {inputContent}
      </NavLink>
    </li>
  );
}

export default NavigationItem;
