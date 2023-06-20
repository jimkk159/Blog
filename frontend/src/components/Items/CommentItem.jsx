import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

// icons
import { MdOutlineRemoveCircleOutline } from "react-icons/md";

// components
import Avatar from "../UI/Avatar";

// helper
import * as helper from "../../utils/helper";
import * as authHelper from "../../utils/auth";

function CommentItem({ comment }) {
  const [isSubmitting, setIsSubmitting] = useState("");

  // redux
  const authId = useSelector((state) => state.auth.id);

  // react-router
  const navigate = useNavigate();

  // custom functions
  const commentId = comment.id;
  const removeCommentHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsSubmitting(true);
      const token = authHelper.getAuthToken();

      if (token && !!comment) {
        await fetch(
          process.env.REACT_APP_BACKEND_URL + `/api/v1/comments/${commentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        ).catch((err) => err);
        navigate(".");
      }
      setIsSubmitting(false);
    },
    [commentId, navigate]
  );

  return (
    <>
      <div className="flex items-end justify-end space-x-3">
        <Avatar
          title={comment.Author.name}
          avatar={comment.Author.avatar}
          className={"h-9 w-9 border-2 border-white md:h-10 md:w-10"}
          onClick={() => navigate(`/profile/${comment.Author.id}`)}
        />
        <div className="flex w-full flex-col items-start space-y-0.5 md:h-10">
          <div className="flex space-x-2">
            <p
              className="flex w-fit cursor-pointer truncate text-xs text-self-pink-500 hover:text-self-pink-600"
              onClick={() => navigate(`/profile/${comment.Author.id}`)}
            >
              {comment.Author.name}
            </p>

            <p className="overflow-ellipsis whitespace-nowrap text-xs italic text-gray-400">
              {helper.formatDate(comment.editedAt)}
            </p>
          </div>
          <p className="h-4 w-full bg-transparent font-poppins text-base text-white">
            {comment.content}
          </p>
        </div>
        {authId === comment.Author.id && !isSubmitting && (
          <MdOutlineRemoveCircleOutline
            className="h-6 w-6 text-gray-400 hover:text-gray-200"
            onClick={removeCommentHandler}
          />
        )}
        {isSubmitting && (
          <ClipLoader aria-label="Loading Spinner" size={12} color="white" />
        )}
      </div>
      <div className="w-full border-b border-self-gray" />
    </>
  );
}

export default CommentItem;
