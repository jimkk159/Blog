// import { NavLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

//CSS
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

//CUSTOM
import classes from "./NavigationItem.module.css";

function NavigationItem(props) {
  if (props.show === false) {
    return;
  }

  if (props.type === "button") {
    return (
      <li className={`${props.className} ${classes["nav-link"]}`}>
        <button onClick={props.onClick} onBlur={props.onBlur}>
          {props.children}
        </button>
      </li>
    );
  }

  if (props.type === "input") {
    return <Fragment onClick={props.onClick}>{props.children}</Fragment>;
  }

  return (
    <li className={`${props.className} ${classes["nav-link"]}`}>
      <NavLink
        to={props.to}
        className={({ isActive }) => (isActive ? classes.active : null)}
      >
        {props.children}
      </NavLink>
    </li>
  );
}

export default NavigationItem;
