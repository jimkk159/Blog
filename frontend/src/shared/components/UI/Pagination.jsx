import React from "react";

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
  } = props;

  const [totalPage, paginationRange] = usePagination({
    totalPosts,
    postsPerPage,
    siblingCount,
    currentPage,
    offsetPosts,
  });

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
    <nav>
      <ul>
        <li onClick={onFirst}>{"|<"}</li>
        <li onClick={onPrev}>{"<"}</li>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <li key={index}>{DOTS}</li>;
          }
          return (
            <li key={index} className="page-item">
              <a href="#" onClick={() => onNavPage(pageNumber)}>
                {pageNumber}
              </a>
            </li>
          );
        })}
        <li onClick={onNext}>{">"}</li>
        <li onClick={onLast}>{">|"}</li>
      </ul>
    </nav>
  );
}

export default Pagination;

//reference:https://www.youtube.com/watch?v=IYCa1F-OWmk
