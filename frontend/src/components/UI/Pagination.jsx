import React from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

//Icon
import { BiFirstPage, BiLastPage } from "react-icons/bi";

//Custom Hook
import usePagination, { DOTS } from "../../hooks/pagination-hook";

//CSS
import classes from "./Pagination.module.css";

function Pagination({
  total = 0,
  limit = 15,
  sibling = 1,
  current = 1,
  onNavPage,
  offset = 0,
}) {
  const paginationRange =
    usePagination({
      total: +total,
      limit: +limit,
      sibling: +sibling,
      current: +current,
      offset: +offset,
    }) ?? [];
    
  const totalPage = paginationRange
    ? paginationRange[paginationRange.length - 1]
    : 1;

  const onFirst = () => {
    onNavPage(1);
  };
  const onNext = () => {
    if (totalPage > current) {
      onNavPage(current + 1);
    }
  };
  const onPrev = () => {
    if (current > 1) {
      onNavPage(current - 1);
    }
  };
  const onLast = () => {
    onNavPage(totalPage);
  };
  if (current < 1 || paginationRange.length < 2) return null;
  return (
    <ul className={`${classes["pagination-container"]}`}>
      <li className={classes["pagination-icon"]} onClick={onFirst}>
        <BiFirstPage />
      </li>
      <li
        className={`${classes["pagination-icon"]} ${
          current === 1 && classes["disabled"]
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
              pageNumber === current && classes["selected"]
            }`}
            onClick={() => onNavPage(pageNumber)}
          >
            <p>{pageNumber}</p>
          </li>
        );
      })}
      <li
        className={`${classes["pagination-icon"]} ${
          current === totalPage && classes["disabled"]
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
