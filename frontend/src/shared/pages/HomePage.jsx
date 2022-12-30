import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";

//Custom Component
import Quote from "../components/Quote";
import PostsInfo from "../../blogs/components/PostsBrowse/PostsInfo";
import Pagination from "../components/UI/Pagination";

//CSS
import classes from "./HomePage.module.css";

//Dummy Data
import { Dummy_blogs } from "../../Dummy_blogs";

const siblingCount = 1;
const postsOfHome = 8;
function HomePage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  // const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [isHome, setIsHome] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [postsPerPage, setPostsPerPage] = useState(10);
  const postsPerPage = 10;

  useEffect(() => {
    //Get Post
    setPosts(Dummy_blogs);
  }, []);

  //Setting Page Post
  let indexOfLastPost, indexOfFirstPost, currentPosts;
  if (isHome) {
    indexOfFirstPost = 0;
    indexOfLastPost = posts.length > postsOfHome ? postsOfHome : posts.length;
    currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  } else {
    indexOfFirstPost = postsOfHome + (currentPage - 2) * postsPerPage;
    indexOfLastPost =
      posts.length > indexOfFirstPost + postsPerPage
        ? indexOfFirstPost + postsPerPage
        : posts.length;
  }

  currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  //Paginate
  const paginateHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
    const checkIsHome = 1 >= pageNumber;
    if (isHome !== checkIsHome) {
      setIsHome(checkIsHome);
    }
  };

  return (
    <div className={classes["container"]}>
      {isHome && (
        <>
          <Quote />
          <hr className={classes["interval-line"]} />
        </>
      )}
      <PostsInfo posts={currentPosts} loading={null} isDarkMode={isDarkMode} />
      <Pagination
        totalPosts={posts.length}
        postsPerPage={postsPerPage}
        siblingCount={siblingCount}
        currentPage={currentPage}
        offsetPosts={postsOfHome}
        isDarkMode={isDarkMode}
        onNavPage={paginateHandler}
      />
    </div>
  );
}

export default HomePage;

//reference1:https://stackoverflow.com/questions/35352638/how-to-get-parameter-value-from-query-string
//reference2:https://ultimatecourses.com/blog/navigate-to-url-query-strings-search-params-react-router
