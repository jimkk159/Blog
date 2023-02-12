import React from "react";
import { useSelector } from "react-redux";
import Editor from "@draft-js-plugins/editor";

//Image
import defaultCoverImage from "../../assets/img/cover/default-cover-2.jpg";

//Custom Function
import { options } from "../util/time";
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
import Relations from "./PostDetail/Widget/Relations";
import PostDetailTitle from "./PostDetail/PostDetailTitle";

//CSS
import classes from "./ReadPost.module.css";

const decorator = createLinkDecorator();
function ReadPost({
  tagsClassName,
  title,
  topics,
  editorState,
  onChange,
  onEdit,
  onDelete,
  isLoading,
}) {
  //Redux
  const { pid, pin, authorId, authorName, authorAvatar, date, coverUrl, tags } =
    useSelector((state) => state.post);
  const isDarkMode = useSelector((state) => state.theme.value);

  return (
    <>
      <Card
        className={`page ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        {!isLoading && (
          <>
            <PostDetailTitle
              title={title}
              postId={pid}
              authorId={authorId}
              authorName={authorName}
              authorAvatar={authorAvatar}
              date={new Date(date).toLocaleDateString("en-US", options)}
              isPined={pin}
              isDarkMode={isDarkMode}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            <div className={`${classes["cover-container"]}`}>
              <div className={`${classes["cover-dummy"]}`}></div>
              <div className={`${classes["cover"]}`}>
                <img
                  src={
                    coverUrl
                      ? coverUrl.startsWith("data:image")
                        ? `${coverUrl}`
                        : `${process.env.REACT_APP_BACKEND_URL}/${coverUrl}`
                      : defaultCoverImage
                  }
                  alt="cover"
                />
              </div>
            </div>
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
            <div className={tagsClassName}>
              <Tags isDarkMode={isDarkMode} content={tags} />
            </div>
          </>
        )}
      </Card>
      <Guide isDarkMode={isDarkMode} topics={topics} />
    </>
  );
}

export default ReadPost;
