import React from "react";
import { useSelector } from "react-redux";
import Editor from "@draft-js-plugins/editor";

//Image
import defaultCoverImage from "../../assets/img/cover/default-cover-2.jpg";

//Custom Function
import { styleMap } from "../../shared/util/style-map";
import plugins from "../../shared/components/TextEditor/Plugin";
import {
  getBlockStyle,
  getCustomStyleFn,
} from "../../shared/components/TextEditor/CustomStyleFn";
import { createLinkDecorator } from "../../shared/components/TextEditor/decorators/LinkDecorator";

//Custom Comonent
import Guide from "./BlogGuide/Guide";
import Tags from "../../shared/components/UI/Tags";
import Card from "../../shared/components/UI/Card";
import Image from "./PostDetail/Widget/Image";
import Relations from "./PostDetail/Widget/Relations";
import PostDetailTitle from "./PostDetail/PostDetailTitle";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

//CSS
import classes from "./ReadPost.module.css";

const isUserAdmin = false;
const decorator = createLinkDecorator();
function ReadPost(props) {
  const {
    postData,
    title,
    topics,
    editorState,
    onChange,
    isLoading,
    onEdit,
  } = props;

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  return (
    <>
      <Card
        className={`page ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        {isLoading && (
          <LoadingSpinner className={`loading-container`} />
        )}
        {!isLoading && postData && (
          <>
            <PostDetailTitle
              title={title}
              author={postData?.author}
              date={postData?.date}
              isPined={postData?.isPined}
              isAdmin={isUserAdmin}
              isDarkMode={isDarkMode}
              onEdit={onEdit}
              onDelete={() => {}}
            />
            <Image
              type="cover"
              img={
                postData?.cover?.img ? postData.cover.img : defaultCoverImage
              }
              description={postData?.description}
              isDarkMode={isDarkMode}
            />
            <Editor
              editorState={editorState}
              onChange={onChange}
              decorators={[decorator]}
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              customStyleFn={getCustomStyleFn}
              plugins={plugins}
              readOnly
            />
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
              <Tags content={postData?.tags} />
            </div>
          </>
        )}
      </Card>
      <Guide isDarkMode={isDarkMode} topics={topics} />
    </>
  );
}

export default ReadPost;
