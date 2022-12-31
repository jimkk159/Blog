import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

//Custom Comonent
import Pagination from "../components/UI/Pagination";
import PostsInfo from "../../blogs/components/PostsBrowse/PostsInfo";

//CSS
import classes from "./SearchPage.module.css";

//Dummy Data
import { Dummy_search } from "../../Dummy_blogs";

const siblingCount = 1;
const postsPerPage = 10;
function PostSearchPage() {

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //React-Router
  const { searchItem } = useParams();
  const [posts, setPosts] = useState([]);
  const [isHome, setIsHome] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    //Get Post
    setPosts(Dummy_search);
  }, []);

  //Setting Page Post
  const currentPosts = posts.slice(0, posts.length);

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
      <PostsInfo posts={currentPosts} loading={null} isDarkMode={isDarkMode} />
      <Pagination
        totalPosts={posts.length}
        postsPerPage={postsPerPage}
        siblingCount={siblingCount}
        currentPage={currentPage}
        isDarkMode={isDarkMode}
        onNavPage={paginateHandler}
      />
    </div>
  );
}

export default PostSearchPage;
