import React from "react";
import SearchIcon from "@mui/icons-material/Search";

//Icon
import { RxCross2 } from "react-icons/rx";

//CSS
import classes from "./Search.module.css";

function Search(props) {
  return (
    <div
      className={`${classes["search-input"]} ${classes.wrapper} ${props.className} `}
      styles={`${props.styles}`}
    >
      {props.showSearch && (
        <div
          className={`${classes.icon} ${classes["input-icon-cross"]} ${
            props.isDarkMode ? classes["icon-dark"] : classes["icon-light"]
          }`}
          onClick={props.onCancel}
        >
          <RxCross2 />
        </div>
      )}
      <div
        className={`${classes.icon} ${classes["input-icon-search"]} ${
          props.isDarkMode ? classes["icon-dark"] : classes["icon-light"]
        }`}
        onClick={props.onToggle}
      >
        <SearchIcon />
      </div>
      <input
        type="text"
        className={`${props.showSearch && classes["input-show"]} ${
          classes.input
        } ${props.isDarkMode ? classes.dark : classes.light}`}
        placeholder={props.showSearch ? "Search..." : null}
      />
    </div>
  );
}

export default Search;
