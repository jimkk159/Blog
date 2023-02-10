import React from "react";
import { useDispatch } from "react-redux";

//Redux Slice
import { postActions } from "../../store/post-slice";

//Custom Component
import Button2 from "../../shared/components/Form/Button2";
import PostEditor from "./PostEditor";

//CSS
import classes from "./EditPost.module.css";

function EditPost({
  token,
  topic,
  topics,
  tags,
  isLoading,
  originState,
  editorState,
  onChange,
  tagState,
  onChangeTag,
  titleState,
  onChangeTitle,
  onTags,
  onTopic,
  onRead,
  onSave,
  onDelete,
  onCover,
}) {
  //Redux
  const dispatch = useDispatch();

  //Cancel the Post
  const cancelPostHandler = () => {
    onRead();
    onChange(originState);
    dispatch(postActions.cancel());
    onCover(null)
  };

  return (
    <>
      <PostEditor
        tags={tags}
        topic={topic}
        topics={topics}
        onTags={onTags}
        onTopic={onTopic}
        editorState={editorState}
        onChange={onChange}
        titleState={titleState}
        onChangeTitle={onChangeTitle}
        tagState={tagState}
        onChangeTag={onChangeTag}
        onCover={onCover}
      />
      <div className={`${classes["btn-container"]}`}>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={() => onSave(token)}
        >
          SAVE
        </Button2>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={onDelete}
        >
          DELETE
        </Button2>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={cancelPostHandler}
        >
          Cancel
        </Button2>
      </div>
    </>
  );
}

export default EditPost;
