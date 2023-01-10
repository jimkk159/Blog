import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

//Custom Hook
import useHttp from "../hooks/http-hook";

//Custom Comonent
import ErrorModal from "../components/UI/Modal/ErrorModal";
import Pagination from "../components/UI/Pagination";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import PostsInfo from "../../blogs/components/PostsBrowse/PostsInfo";

//CSS
import classes from "./SearchPage.module.css";

const siblingCount = 1;
const postsPerPage = 10;
function PostSearchPage() {
  const [posts, setPosts] = useState([]);
  const [isHome, setIsHome] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //React-Router
  const { searchItem } = useParams();

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //Setting Page Post
  let indexOfFirstPost, indexOfLastPost, currentPosts;
  indexOfFirstPost = (currentPage - 1) * postsPerPage;
  indexOfLastPost =
    posts.length > indexOfFirstPost + postsPerPage
      ? indexOfFirstPost + postsPerPage
      : posts.length;

  currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  //Paginate
  const paginateHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
    const checkIsHome = 1 >= pageNumber;
    if (isHome !== checkIsHome) {
      setIsHome(checkIsHome);
    }
  };

  //Fetch Search Result
  useEffect(() => {
    const fetchSearchPosts = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `posts/search?search=${searchItem}`
        );
        setPosts(responseData);
      } catch (err) {}
    };
    fetchSearchPosts();
  }, [searchItem, sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} isAnimate />
      <div className={classes["container"]}>
        {isLoading && (
          <LoadingSpinner className={`${classes["loading-container"]}`} />
        )}
        {!isLoading && posts.length === 0 && <h1 className="center">Search Not Found</h1>}
        {!isLoading && posts.length > 0 && (
          <>
            <PostsInfo posts={currentPosts} isDarkMode={isDarkMode} />
            <Pagination
              totalPosts={posts.length}
              postsPerPage={postsPerPage}
              siblingCount={siblingCount}
              currentPage={currentPage}
              isDarkMode={isDarkMode}
              onNavPage={paginateHandler}
            />
          </>
        )}
      </div>
    </>
  );
}

export default PostSearchPage;
