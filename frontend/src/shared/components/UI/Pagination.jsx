import React from "react";

//CSS
import classes from "./Pagination.module.css";

function Pagination(props) {
  const pageNumbers = [];
  const {totalPosts, postsPerPage, onPaginate} = props
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <ul>
        {pageNumbers.map((number, index) => (
          <li key={index} className="page-item">
            <a href="#" onClick={()=>onPaginate(number)}>{number}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
