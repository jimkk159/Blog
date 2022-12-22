import React from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

//Custom Component
import Quote from "../components/Quote";
import PostInfo from "../../blogs/components/PostInfo";

//CSS
import classes from "./HomePage.module.css";

import { Dummy_blogs } from "./Dummy_blogs";

const isUserAdmin = false;
function HomePage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  let isHome = true;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.floor(searchParams.get("page"));
  console.log(typeof page);
  console.log(typeof searchParams.get("page"));
  if (page && page >= 2) {
    isHome = false;
  }
  let postStart = isHome ? 0 : 10 * Math.floor(page - 2) + 8;
  let postEnd = isHome ? 8 : 10 * Math.floor(page - 1) + 8;
  return (
    <div>
      {isHome && (
        <>
          <Quote />
          <hr className={classes["interval-line"]} />
        </>
      )}
      {Dummy_blogs.slice(postStart, postEnd).map((blogs, index) => (
        <PostInfo
          key={index}
          title={blogs.title}
          image={blogs.cover}
          description={blogs.description}
          author={blogs.author}
          date={blogs.date}
          isPined={blogs.isPined}
          isDarkMode={isDarkMode}
          isAdmin={isUserAdmin}
          isOdd={index % 2 ? true : false}
        />
      ))}
      <p></p>
    </div>
  );
}

export default HomePage;

//reference1:https://stackoverflow.com/questions/35352638/how-to-get-parameter-value-from-query-string
//reference2:https://ultimatecourses.com/blog/navigate-to-url-query-strings-search-params-react-router
