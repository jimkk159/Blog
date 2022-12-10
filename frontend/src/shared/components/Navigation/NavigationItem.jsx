// import { NavLink } from "react-router-dom";

//CSS
import { NavLink } from "react-router-dom";

//CUSTOM Component
import classes from "./NavigationItem.module.css";

/**
 * Naviagtion Bar Item
 * @param show show the Item or not.
 * @param type the Item type e.g. button, anchor.
 * @param to the Item redirect link.
 * @param onClick if the type is button, onClick will triger when the button been clcik
 * @param element if exist the input element will be element, otherwise it will be children
 */
function NavigationItem(props) {
  const inputElement = props.element ? props.element : props.children;

  // Show Item or not
  if (props.show === false) {
    return;
  }

  // Type Button
  if (props.type === "button") {
    return (
      <li className={`${props.className} ${classes["nav-link"]}`}>
        <button onClick={props.onClick} onBlur={props.onBlur}>
          {inputElement}
        </button>
      </li>
    );
  }

  //Default Type Anchor
  return (
    <li className={`${props.className} ${classes["nav-link"]}`}>
      <NavLink
        to={props.to}
        className={({ isActive }) => (isActive ? classes.active : null)}
      >
        {inputElement}
      </NavLink>
    </li>
  );
}

export default NavigationItem;
