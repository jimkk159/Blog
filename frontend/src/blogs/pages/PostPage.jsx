import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

//Image
import defaultCoverImage from "../../assets/img/cover/default-cover-2.jpg";

//Custom Function
import { choiceLanguage } from "../util/choiceLanguage";

//Custom Comonent
import Guide from "../components/BlogGuide/Guide";
import Tags from "../../shared/components/UI/Tags";
import Card from "../../shared/components/UI/Card";
import Image from "../components/PostDetail/Widget/Image";
import Relations from "../components/PostDetail/Widget/Relations";
import PostDetailTitle from "../components/PostDetail/PostDetailTitle";
import CreateWidget from "../components/PostDetail/CreateWidget";

//CSS
import classes from "./PostPage.module.css";

//Dummy Data
import { Dummy_blogs, DUMMY_Structure } from "../../Dummy_blogs";

const isUserAdmin = false;
function PostPage(props) {
  const isDarkMode = useSelector((state) => state.theme.value);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const { blogId } = useParams();
  const { author, date, isPined, cover, tags, language } = Dummy_blogs[blogId];
  const postCover = cover.img ? cover.img : defaultCoverImage;
  const title = choiceLanguage(
    isEnglish,
    language.en?.title,
    language.ch?.title,
    "No Title"
  );
  const structure = choiceLanguage(
    isEnglish,
    language.en?.structure,
    language.ch?.structure,
    []
  );
  return (
    <div className={classes["flex-container"]}>
      <Card
        className={`${classes["page"]} ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        <PostDetailTitle
          title={title}
          author={author}
          date={date}
          isPined={isPined}
          isAdmin={isUserAdmin}
          isDarkMode={isDarkMode}
        />
        <Image
          type="cover"
          img={postCover}
          description={cover.description}
          isDarkMode={isDarkMode}
        />
        {structure.map((element, index) => (
          <CreateWidget key={index} isDarkMode={isDarkMode} widget={element} />
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
          <Tags content={tags} />
        </div>
      </Card>
      <Guide isDarkMode={isDarkMode} topicRelation={DUMMY_Structure} />
    </div>
  );
}

export default PostPage;
