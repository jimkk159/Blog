import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";

//Custom Hook
import useHttp from "../hooks/http-hook";
import useTopic from "../hooks/get-topic-hook";

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
  const [searchContent, setSearchContent] = useState("");
  const [isHome, setIsHome] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //React-Router
  const location = useLocation();
  const navigate = useNavigate();
  const { searchItem } = useParams();
  const search = location?.state?.search;

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const {
    fetchTopics,
    isLoading: isLoadingTopic,
    error: errorTopic,
    clearError: clearErrorTopic,
  } = useTopic();

  //Setting Page Post
  let indexOfFirstPost, indexOfLastPost, currentPosts;
  indexOfFirstPost = (currentPage - 1) * postsPerPage;
  indexOfLastPost =
    posts.length > indexOfFirstPost + postsPerPage
      ? indexOfFirstPost + postsPerPage
      : posts.length;

  currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  //Input Search
  const searchChangeHandler = (event) => {
    setSearchContent(event.target.value);
  };

  const searchHandler = (event) => {
    if (event.key === "Enter" && searchContent) {
      navigate(`/search/${searchContent}`, {
        state: { search: searchContent },
      });
      setSearchContent("");
    }
  };

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
            `/posts/search?query=${searchItem}`
        );
        setPosts(responseData);
      } catch (err) {}
    };
    fetchSearchPosts();
    (async function fetch() {
      await fetchTopics();
    })();
  }, [searchItem, sendRequest, fetchTopics]);

  useEffect(() => {
    setSearchContent(search);
  }, [search]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} isAnimate />
      <ErrorModal error={errorTopic} onClear={clearErrorTopic} isAnimate />
      <div className={classes["container"]}>
        {(isLoading || isLoadingTopic) && (
          <LoadingSpinner className={`loading-container`} />
        )}
        <input
          type="text"
          className={`${classes["search"]} ${
            isDarkMode ? classes["search-dark"] : classes["search-light"]
          }`}
          value={searchContent}
          placeholder={"Search..."}
          onKeyDown={searchHandler}
          onChange={searchChangeHandler}
        />
        {!isLoading && posts.length === 0 && (
          <h1 className={`center ${classes["not-find"]}`}>Search Not Found</h1>
        )}
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
