import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

//Icon
import { RxCross2 } from "react-icons/rx";

//CSS
import classes from "./Search.module.css";

function Search(props) {
  const [isSearch, setIsSearch] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const navigate = useNavigate();

  //Toggle Search Bar
  const toggleSearchHandler = () => {
    if (searchItem !== "") {
      navigate(`/search/${searchItem}`);
      setSearchItem("");
    } else {
      setIsSearch((prev) => !prev);
      if (isSearch) {
        setSearchItem("");
      }
    }
  };

  //Open Search Bar
  const openSearchHandler = () => {
    setIsSearch(true);
  };

  //Close Search Bar
  const closeSearchHandler = () => {
    setIsSearch(false);
    setSearchItem("");
  };

  //Input Search
  const searchChangeHandler = (event) => {
    if (isSearch) {
      setSearchItem(event.target.value);
    }
  };

  //Search
  const searchHandler = (event) => {
    if (isSearch && event.key === "Enter" && searchItem) {
      navigate(`/search/${searchItem}`);
      setSearchItem("");
    }
  };

  return (
    <div
      className={`${classes["search-container"]} ${classes.wrapper} ${props.className} `}
      styles={`${props.styles}`}
    >
      {isSearch && (
        <div
          className={`${classes.icon} ${classes["input-icon-cross"]} ${
            props.isDarkMode ? classes["icon-dark"] : classes["icon-light"]
          }`}
          onClick={closeSearchHandler}
        >
          <RxCross2 />
        </div>
      )}
      <div
        className={`${classes.icon} ${classes["input-icon-search"]} ${
          props.isDarkMode ? classes["icon-dark"] : classes["icon-light"]
        }`}
        onClick={toggleSearchHandler}
      >
        <SearchIcon />
      </div>
      <input
        type="text"
        className={`${!isSearch && classes["input-hide"]} ${classes.input} ${
          props.isDarkMode ? classes.dark : classes.light
        }`}
        placeholder={isSearch ? "Search..." : null}
        onFocus={openSearchHandler}
        onChange={searchChangeHandler}
        onKeyDown={searchHandler}
        value={searchItem}
      />
    </div>
  );
}

export default Search;
