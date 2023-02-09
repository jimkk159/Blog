import React from "react";

//Custom Component
import Tags from "../../shared/components/UI/Tags";
import Button2 from "../../shared/components/Form/Button2";
import Backdrop from "../../shared/components/UI/Backdrop";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import RichTextEditor from "../../shared/components/TextEditor/RichTextEditor";

//CSS
import classes from "./EditPost.module.css";

function EditPost({
  tagsClassName,
  post,
  originState,
  editorState,
  isLoading,
  error,
  clearError,
  token,
  onChange,
  onSave,
  onRead,
  onDelete,
}) {
  //Save Post
  const savePostHandler = () => {
    onSave(token);
  };

  //Cancel the Post
  const cancelPostHandler = () => {
    onRead();
    onChange(originState);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <>
          <Backdrop />
          <div className={`${classes["loading-container"]}`}>
            <LoadingSpinner asOverlay />
          </div>
        </>
      )}
      <RichTextEditor
        originState={originState}
        editorState={editorState}
        onChange={onChange}
      />
      <div className={tagsClassName}>
        <Tags content={post?.tags} />
      </div>
      <div className={`${classes["btn-container"]}`}>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={savePostHandler}
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
