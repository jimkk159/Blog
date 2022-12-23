import React from "react";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

//Custom Component
import Icon from "../Icons/Icon";

//Custom Hook
import usePagination, { DOTS } from "../../hooks/pagination-hook";

//CSS
import classes from "./Pagination.module.css";

function Pagination(props) {
  const {
    totalPosts,
    postsPerPage,
    siblingCount = 1,
    currentPage,
    onNavPage,
    offsetPosts,
    isDarkMode
  } = props;

  const paginationRange = usePagination({
    totalPosts,
    postsPerPage,
    siblingCount,
    currentPage,
    offsetPosts,
  });
  const totalPage = paginationRange[paginationRange.length - 1];
  const onFirst = () => {
    onNavPage(1);
  };
  const onNext = () => {
    if (totalPage > currentPage) {
      onNavPage(currentPage + 1);
    }
  };

  const onPrev = () => {
    if (currentPage > 1) {
      onNavPage(currentPage - 1);
    }
  };
  const onLast = () => {
    onNavPage(totalPage);
  };
  if (currentPage < 1 || paginationRange.length < 2) return null;
  return (
    <ul
      className={`${classes["pagination-container"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
    >
      <li className={classes["pagination-icon"]} onClick={onFirst}>
        <BiFirstPage />
      </li>
      <li
        className={`${classes["pagination-icon"]} ${
          currentPage === 1 && classes["disabled"]
        }`}
        onClick={onPrev}
      >
        <MdNavigateBefore />
      </li>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={index}
              className={`${classes["pagination-item"]} ${classes["dots"]}`}
            >
              &#8230;
            </li>
          );
        }
        return (
          <li
            key={index}
            className={`${classes["pagination-item"]} ${
              pageNumber === currentPage && classes["selected"]
            }`}
            onClick={() => onNavPage(pageNumber)}
          >
            <a href="#">{pageNumber}</a>
          </li>
        );
      })}
      <li
        className={`${classes["pagination-icon"]} ${
          currentPage === totalPage && classes["disabled"]
        }`}
        onClick={onNext}
      >
        <MdNavigateNext />
      </li>
      <li className={classes["pagination-icon"]} onClick={onLast}>
        <BiLastPage />
      </li>
    </ul>
  );
}

export default Pagination;

//reference:https://www.youtube.com/watch?v=IYCa1F-OWmk
