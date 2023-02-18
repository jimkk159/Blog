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
  editorState,
  onChange,
  onEdit,
  onDelete,
  isLoading,
}) {
  //Redux
  const { topics } = useSelector((state) => state.topic);
  const {
    id,
    pin,
    authorId,
    author,
    avatar,
    date,
    coverUrl,
    topicCover,
    related,
    tags,
  } = useSelector((state) => state.post);
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
              postId={id}
              authorId={authorId}
              author={author}
              avatar={avatar}
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
                      ? coverUrl
                      : topicCover
                      ? topicCover
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
            <Relations related={related} />
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
