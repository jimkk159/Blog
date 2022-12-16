import React from "react";
import { RxCross2 } from "react-icons/rx";
import SearchIcon from "@mui/icons-material/Search";


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
          className={`${classes.icon} ${classes["input-icon-cross"]}`}
          onClick={props.onCancel}
        >
          <RxCross2 />
        </div>
      )}
      <div
        className={`${classes.icon} ${classes["input-icon-search"]}`}
        onClick={props.onToggle}
      >
        <SearchIcon />
      </div>
      <input
        type="text"
        className={`${props.showSearch && classes["input-show"]} ${
          classes.input
        }`}
        placeholder={props.showSearch ? "Search..." : null}
      />
    </div>
  );
}

export default Search;
