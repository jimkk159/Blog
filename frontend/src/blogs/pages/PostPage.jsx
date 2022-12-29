import React from "react";
import { useSelector } from "react-redux";

//Custom Comonent
import Image from "../components/Widget/Image";
import Guide from "../components/BlogGuide/Guide";
import Tags from "../../shared/components/UI/Tags";
import Card from "../../shared/components/UI/Card";
import CreateWidget from "../components/CreateWidget";
import Relations from "../components/Widget/Relations";

//CSS
import classes from "./PostPage.module.css";

//Dummy Data
import { Dummy_blogs } from "../../Dummy_blogs";

function PostPage(props) {
  const isDarkMode = useSelector((state) => state.theme.value);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const { cover, tags } = Dummy_blogs[0];
  let title, structure;
  title = isEnglish
    ? Dummy_blogs[0].language.en.title
    : Dummy_blogs[0].language.ch.title;
  structure = isEnglish
    ? Dummy_blogs[0].language.en.structure
    : Dummy_blogs[0].language.ch.structure;
    
  return (
    <div className={classes["flex-container"]}>
      <Card
        className={`${classes["page"]} ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        <h1 className={classes["title"]}>{title}</h1>
        <hr className={classes["title-hr"]} />
        <Image
          type="cover"
          img={cover.img}
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
      <Guide isDarkMode={isDarkMode} />
    </div>
  );
}

export default PostPage;
