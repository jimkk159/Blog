import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// components
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";

// helper
import * as authHelper from "../../utils/auth";

function NewComment({ post }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

  // redux
  const { avatar } = useSelector((state) => state.auth);

  // react-router
  const navigate = useNavigate();

  // custom functions
  const postId = post.id;
  const publishCommentHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsSubmitting(true);
      const token = authHelper.getAuthToken();
      if (token && !!comment) {
        await fetch(
          process.env.REACT_APP_BACKEND_URL +
            `/api/v1/posts/${postId}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              content: comment,
            }),
          }
        ).catch((err) => err);
        setComment("");
        navigate(".");
      }
      setIsSubmitting(false);
    },
    [postId, comment, navigate]
  );

  return (
    <div className="flex items-center space-x-3 ">
      <Avatar
        avatar={avatar}
        className={"h-9 w-9 border-2 border-white md:h-10 md:w-10"}
        onClick={() => navigate(`/profile/${post.Author.id}`)}
      />
      <div className="mt-4 flex w-full flex-col items-end space-y-2">
        <input
          type="text"
          className="h-8 w-full border-b-2 bg-transparent font-poppins text-sm text-white caret-white outline-none"
          placeholder="Write something..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex space-x-4">
          <Button
            type="button"
            className={
              "rounded-3xl border-2 bg-transparent px-4 py-0.5 shadow-xl disabled:border-self-gray disabled:text-self-gray " +
              "border-self-pink-600 text-self-pink-600 hover:border-self-pink-500 hover:text-self-pink-500"
            }
            loading={isSubmitting}
            disabled={isSubmitting || !comment}
            textProps={{ className: "text-sm" }}
            spinner={{ color: "text-self-pink-500" }}
            onClick={publishCommentHandler}
          >
            Publish
          </Button>
          <Button
            disabled={isSubmitting || !comment}
            className="text-sm text-self-gray hover:text-white disabled:hover:text-self-gray"
            onClick={() => setComment("")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewComment;
