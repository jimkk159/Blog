import React from "react";
import { useSelector } from "react-redux";

//Custom Comonent
import Cover from "../components/Widget/Cover";
import SubTitle from "../components/Widget/SubTitle";
import PostList from "../components/Widget/PostList";
import Relations from "../components/Widget/Relations";
import Guide from "../components/BlogGuide/Guide";
import Seperation from "../components/Widget/Seperation";
import Description from "../components/Widget/Description";
import EmphasizeTitle from "../components/Widget/EmphasizeTitle";
import Tags from "../../shared/components/UI/Tags";
import Card from "../../shared/components/UI/Card";

//CSS
import classes from "./PostPage.module.css";

//Dummy Data
import { Dummy_blogs } from "../../Dummy_blogs";

function PostPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  const { title, description, cover, tags } = Dummy_blogs[0];

  return (
    <div className={classes["flex-container"]}>
      <Card
        className={`${classes["page"]} ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        <h1 className={classes["title"]}>{title}</h1>
        <hr className={classes["title-hr"]} />
        <Cover cover={cover} isDarkMode={isDarkMode} />
        <Description content={description} />

        <SubTitle content={"Confusion Matrix"} />
        <Description
          content={
            "混淆矩陣 (Confusion Matrix) 是由 TP、FP、FN、TN 四種狀況所組合而成，可以很清楚地反映各類別之間被劃分的關係，並且藉由confusion matrix 可以再延伸出其他評估指標。"
          }
        />
        <Description
          content={
            "來看一下 TP、FP、FN、TN的定義，假設我們要預測的類別有兩個類別，分別為有病 (label=1) 以及沒病(label=0)"
          }
        />
        <PostList
          content={[
            "TP (True Positive，真陽性)：該類別實際為有病，預測也為有病，表示檢測正確",
            "FP (False Positive，真陰性)：該類別實際為沒有病，預測成有病，表示誤檢",
            "FN (False Negative，假陰性)：該類別實際為有病，預測為沒有病，表示漏檢",
            "TN (TrueNegative，假陽性)：該類別實際為沒有病，預測也為沒有病，即表示不需要被檢測的地方沒被檢測出來",
          ]}
        />
        <Seperation isDarkMode={isDarkMode} />
        <EmphasizeTitle isDarkMode={isDarkMode} />
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
