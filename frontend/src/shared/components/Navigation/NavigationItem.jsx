// import { NavLink } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';

//CSS
import { Fragment } from "react";
import classes from "./NavigationItem.module.css";

function NavigationItem(props) {
  if (props.show === false) {
    return;
  }

  if (props.type === "button") {
    return (
      <li className={`${props.className} ${classes["nav-link"]}`}>
        <button onClick={props.onClick}>{props.children}</button>
      </li>
    );
  }

  if (props.type === "input") {
    return (
      <Fragment onClick={props.onClick}>
        {props.children}
      </Fragment>
    );
  }

  return (
    <li className={`${props.className} ${classes["nav-link"]}`}>
      <a href={props.to}>{props.children}</a>
    </li>
  );
}

export default NavigationItem;
