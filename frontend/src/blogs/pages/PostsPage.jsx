import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";

//Custom Hook
import { useHttp } from "../../shared/hooks/http-hook";

//Custom Component
import Quote from "../../shared/components/Quote";
import PostsInfo from "../components/PostsBrowse/PostsInfo";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import Pagination from "../../shared/components/UI/Pagination";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

//CSS
import classes from "./PostsPage.module.css";

const postsOfHome = 8;
const siblingCount = 1;
const postsPerPage = 10;
function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isHome, setIsHome] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //Setting Page Post
  let indexOfFirstPost, indexOfLastPost, currentPosts;
  if (isHome) {
    indexOfFirstPost = 0;
    indexOfLastPost = posts.length > postsOfHome ? postsOfHome : posts.length;
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

  //Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "posts"
        );
        setPosts(responseData);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest]);

  return (
    <div className={classes["container"]}>
      <ErrorModal error={error} onClear={clearError} isAnimate />
      {isHome && (
        <>
          <Quote />
          <hr className={classes["interval-line"]} />
        </>
      )}
      {isLoading && (
        <LoadingSpinner className={`${classes["loading-container"]}`} />
      )}
      {!isLoading && posts && (
        <>
          <PostsInfo
            posts={currentPosts}
            loading={null}
            isDarkMode={isDarkMode}
          />
          <Pagination
            totalPosts={posts.length}
            postsPerPage={postsPerPage}
            siblingCount={siblingCount}
            currentPage={currentPage}
            offsetPosts={postsOfHome}
            isDarkMode={isDarkMode}
            onNavPage={paginateHandler}
          />
        </>
      )}
    </div>
  );
}

export default HomePage;
//reference1:https://stackoverflow.com/questions/35352638/how-to-get-parameter-value-from-query-string
//reference2:https://ultimatecourses.com/blog/navigate-to-url-query-strings-search-params-react-router
//reference3:https://reactrouter.com/en/main/route/error-element
