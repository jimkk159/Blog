import React from "react";
import { useSelector } from "react-redux";

//Custom Comonent
import Guide from "../components/BlogGuide/Guide";
import Card from "../../shared/components/UI/Card";

//CSS
import classes from "./PostPage.module.css";

//Dummy Data
import { Dummy_blogs } from "../../Dummy_blogs";

function PostPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  const { title, description, cover } = Dummy_blogs[0];

  return (
    <div className={classes["flex-container"]}>
      <Card
        className={`${classes["page"]} ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        <h1 className={classes["title"]}>{title}</h1>
        <hr className={classes["title-hr"]} />
        <img src={cover} alt={"Post Cover"} className={classes["cover"]} />
        <p className={classes["img-comment"]}>
          公司在 wework 辦公時我非常喜歡他們的 slogan
        </p>
        <p className={classes["description"]}>{description}</p>
        <h2 className={classes["section-title"]}>Confusion Matrix</h2>
        <p className={`${classes["description"]} ${classes["description-1"]}`}>
          混淆矩陣 (Confusion Matrix) 是由 TP、FP、FN、TN
          四種狀況所組合而成，可以很清楚地反映各類別之間被劃分的關係，並且藉由
          confusion matrix 可以再延伸出其他評估指標。
        </p>
        <p className={`${classes["description"]} ${classes["description-2"]}`}>
          來看一下 TP、FP、FN、TN
          的定義，假設我們要預測的類別有兩個類別，分別為有病 (label=1) 以及沒病
          (label=0)
        </p>
        <ul className={`${classes["list-items"]}`}>
          <li className={`${classes["list-item"]}`}>
            TP (True
            Positive，真陽性)：該類別實際為有病，預測也為有病，表示檢測正確
          </li>
          <li className={`${classes["list-item"]}`}>
            FP (False
            Positive，真陰性)：該類別實際為沒有病，預測成有病，表示誤檢
          </li>
          <li className={`${classes["list-item"]}`}>
            FN (False
            Negative，假陰性)：該類別實際為有病，預測為沒有病，表示漏檢
          </li>
          <li className={`${classes["list-item"]}`}>
            TN (True
            Negative，假陽性)：該類別實際為沒有病，預測也為沒有病，即表示不需要被檢測的地方沒被檢測出來
          </li>
        </ul>
        <div className={classes["seperation"]}>
          <span className={classes["seperation-dot"]}></span>
          <span className={classes["seperation-dot"]}></span>
          <span className={classes["seperation-dot"]}></span>
        </div>
        <h1 className={classes["relation-title"]}>Segmentation 相關文章</h1>
        <ul className={classes["relation-items"]}>
          <li className={classes["relation-item"]}>
            YOLACT (You Only Look At CoefficienTs) 系列介紹
          </li>
          <li className={classes["relation-item"]}>YOLACT 訓練教學</li>
          <li className={classes["relation-item"]}>
            影像分割 Image Segmentation — 語義分割 Semantic Segmentation(1)
          </li>
        </ul>
      </Card>
      <Guide isDarkMode={isDarkMode} />
    </div>
  );
}

export default PostPage;
