import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

//Custom Component
import Quote from "../components/Quote";
import Posts from "../../blogs/components/Posts";
import Pagination from "../components/UI/Pagination";

//CSS
import classes from "./HomePage.module.css";

//Dummy Data
import { Dummy_blogs } from "./Dummy_blogs";

function HomePage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  let isHome = true;
  const [searchParams, setSearchParams] = useSearchParams();
  // const page = Math.floor(searchParams.get("page"));
  // if (page && page >= 2) {
  //   isHome = false;
  // }
  // let postStart = isHome ? 0 : 10 * Math.floor(page - 2) + 8;
  // let postEnd = isHome ? 8 : 10 * Math.floor(page - 1) + 8;
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  useEffect(() => {
    //Get Post
    setPosts(Dummy_blogs);
  }, []);

  //Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  return (
    <div>
      {isHome && (
        <>
          <Quote />
          <hr className={classes["interval-line"]} />
        </>
      )}
      <Posts posts={currentPosts} loading={isLoading} isDarkMode={isDarkMode} />
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        onPaginate={(num) => {
          console.log(num, "paginate");
        }}
      />
    </div>
  );
}

export default HomePage;

//reference1:https://stackoverflow.com/questions/35352638/how-to-get-parameter-value-from-query-string
//reference2:https://ultimatecourses.com/blog/navigate-to-url-query-strings-search-params-react-router
