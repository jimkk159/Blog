import React, { useEffect, useState, Suspense } from "react";
import { useSelector } from "react-redux";
import { Await, defer, useLoaderData } from "react-router-dom";
// import { useSearchParams } from "react-router-dom";

//Custom function
import { getPosts } from "../../shared/util/api";

//Custom Hook
import { useHttp } from "../../shared/hooks/http-hook";

//Custom Component
import Quote from "../../shared/components/Quote";
import PostsInfo from "../components/PostsBrowse/PostsInfo";
import Pagination from "../../shared/components/UI/Pagination";

//CSS
import classes from "./PostsPage.module.css";

const postsOfHome = 8;
const siblingCount = 1;
const postsPerPage = 10;
function HomePage() {
  const [isHome, setIsHome] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // const { isLoading, error, sendRequest, clearError } = useHttp();

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //React-Router
  const loaderData = useLoaderData();
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const responseData = await sendRequest(
  //         process.env.REACT_APP_BACKEND_URL + "posts"
  //       );
  //       setPosts(responseData);
  //     } catch (err) {}
  //   };
  //   fetchPosts();
  // }, [sendRequest]);

  //Setting Page Post
  let indexOfLastPost, indexOfFirstPost, currentPosts;
  if (isHome) {
    indexOfFirstPost = 0;
    indexOfLastPost =
      loaderData.posts.length > postsOfHome ? postsOfHome : loaderData.posts.length;
  } else {
    indexOfFirstPost = postsOfHome + (currentPage - 2) * postsPerPage;
    indexOfLastPost =
      loaderData.posts.length > indexOfFirstPost + postsPerPage
        ? indexOfFirstPost + postsPerPage
        : loaderData.posts.length;
  }

  currentPosts = loaderData.posts.slice(indexOfFirstPost, indexOfLastPost);

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
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={loaderData.posts}>
          {(currentPosts) => (
            <PostsInfo
              posts={currentPosts}
              loading={null}
              isDarkMode={isDarkMode}
            />
          )}
        </Await>
      </Suspense>
      <Pagination
        totalPosts={loaderData.posts.length}
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

export async function loader() {
  return defer({ posts: await getPosts() });
}

//reference1:https://stackoverflow.com/questions/35352638/how-to-get-parameter-value-from-query-string
//reference2:https://ultimatecourses.com/blog/navigate-to-url-query-strings-search-params-react-router
