import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

//Image
import defaultCoverImage from "../../assets/img/cover/default-cover-2.jpg";

//Custom Function
import { choiceLanguage } from "../util/choiceLanguage";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//Custom Comonent
import Guide from "../components/BlogGuide/Guide";
import Tags from "../../shared/components/UI/Tags";
import Card from "../../shared/components/UI/Card";
import Image from "../components/PostDetail/Widget/Image";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import CreateWidget from "../components/PostDetail/CreateWidget";
import Relations from "../components/PostDetail/Widget/Relations";
import PostDetailTitle from "../components/PostDetail/PostDetailTitle";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

//CSS
import classes from "./PostPage.module.css";

const isUserAdmin = false;
function PostPage(props) {
  const [post, setPost] = useState(null);
  const [topics, setTopics] = useState(null);
  const [title, setTitle] = useState("No Title");
  const [structure, setStructure] = useState([]);

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const isEnglish = useSelector((state) => state.language.isEnglish);

  //React Router
  const { blogId } = useParams();

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //GET Topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "topics"
        );
        setTopics(responseData);
      } catch (err) {}
    };
    fetchTopics();
  }, [sendRequest]);

  //GET POST
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `posts/${blogId}`
        );
        setTitle(
          choiceLanguage(
            isEnglish,
            responseData?.language.en?.title,
            responseData?.language.ch?.title,
            "No Title"
          )
        );
        setStructure(
          choiceLanguage(
            isEnglish,
            responseData?.language.en?.structure,
            responseData?.language.ch?.structure,
            []
          )
        );
        setPost(responseData);
      } catch (err) {}
    };
    fetchPost();
  }, [isEnglish, blogId, sendRequest]);

  return (
    <div className={classes["flex-container"]}>
      <ErrorModal error={error} onClear={clearError} isAnimate />
      <Card
        className={`${classes["page"]} ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        {isLoading && (
          <LoadingSpinner className={`${classes["loading-container"]}`} />
        )}
        {!isLoading && post && (
          <>
            <PostDetailTitle
              title={title}
              author={post?.author}
              date={post?.date}
              isPined={post?.isPined}
              isAdmin={isUserAdmin}
              isDarkMode={isDarkMode}
            />
            <Image
              type="cover"
              img={post?.cover?.img ? post.cover.img : defaultCoverImage}
              description={post?.description}
              isDarkMode={isDarkMode}
            />
            {structure.map((element, index) => (
              <CreateWidget
                key={index}
                isDarkMode={isDarkMode}
                widget={element}
              />
            ))}
            <Relations
              isDarkMode={isDarkMode}
              relations={[
                "YOLACT (You Only Look At CoefficienTs) 系列介紹",
                "YOLACT 訓練教學",
                "蛤????",
                "影像分割 Image Segmentation — 語義分割 Semantic Segmentation(1)",
              ]}
            />
            <div className={classes["tags-container"]}>
              <Tags content={post?.tags} />
            </div>
          </>
        )}
      </Card>
      <Guide isDarkMode={isDarkMode} topics={topics} />
    </div>
  );
}

export default PostPage;
