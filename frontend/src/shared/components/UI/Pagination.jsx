import React from "react";

//CSS
import classes from "./Pagination.module.css";

function Pagination(props) {
  const pageNumbers = [1];
  const { totalPosts, offsetPosts, postsPerPage, onPaginate } = props;
  for (
    let i = 2;
    i <= Math.ceil((totalPosts - offsetPosts) / postsPerPage)+1;
    i++
  ) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <ul>
        {pageNumbers.map((number, index) => (
          <li key={index} className="page-item">
            <a href="#" onClick={() => onPaginate(number)}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
