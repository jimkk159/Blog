import React from "react";
import SearchIcon from "@mui/icons-material/Search";

//CSS
import classes from "./Search.module.css";

function Search(props) {
  return (
    <div className={`${props.className} ${classes.wrapper}`}>
      <div className={classes.icon}>
        <SearchIcon />
      </div>
      <input type="text" className={classes.input} placeholder="Search..." />
    </div>
  );
}

export default Search;
