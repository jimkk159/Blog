import React, { useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import SearchIcon from "@mui/icons-material/Search";

//Custom Context
import { ThemeContext } from "../../context/theme-context";

//CSS
import classes from "./Search.module.css";

function Search(props) {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`${classes["search-input"]} ${classes.wrapper} ${props.className} `}
      styles={`${props.styles}`}
    >
      {props.showSearch && (
        <div
          className={`${classes.icon} ${classes["input-icon-cross"]} ${
            isDarkMode ? classes["icon-dark"] : classes["icon-light"]
          }`}
          onClick={props.onCancel}
        >
          <RxCross2 />
        </div>
      )}
      <div
        className={`${classes.icon} ${classes["input-icon-search"]} ${
          isDarkMode ? classes["icon-dark"] : classes["icon-light"]
        }`}
        onClick={props.onToggle}
      >
        <SearchIcon />
      </div>
      <input
        type="text"
        className={`${props.showSearch && classes["input-show"]} ${
          classes.input
        } ${isDarkMode ? classes.dark : classes.light}`}
        placeholder={props.showSearch ? "Search..." : null}
      />
    </div>
  );
}

export default Search;
