import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { FiThumbsUp } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";

// components
import Avatar from "../UI/Avatar";
import * as helper from "../../utils/helper";
import * as authHelper from "../../utils/auth";

function CarouselItem({ post }) {
  // react-router
  const navigate = useNavigate();

  // components
  const postId = post.id;
  const increaseThumbs = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const token = authHelper.getAuthToken();

      if (token) {
        await fetch(
          process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/${postId}/thumb`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        ).catch((err) => err);
        navigate(".");
      }
    },
    [postId, navigate]
  );

  return (
    <div className="flex items-center justify-center">
      <div className="my-8 flex w-full max-w-[270px] flex-col space-y-4 rounded-3xl border-2 border-zinc-600 p-2 py-4 text-white md:p-4">
        <div
          className="h-[421px] w-full cursor-pointer"
          onClick={() => navigate(`/posts/${post.id}`)}
        >
          <img
            alt="preview"
            title={post.title}
            className="h-full w-full rounded-3xl object-cover"
            src={helper.creatPreviewImg(post.previewImg)}
          />
        </div>
        <div className="flex h-full items-end justify-between">
          <div className="flex h-16 flex-col justify-between">
            <div className="flex items-center justify-center space-x-1">
              <div>
                <Avatar
                  title="To author profile"
                  className={`h-4 w-4 cursor-pointer border border-gray-500`}
                  avatar={post.Author.avatar}
                  onClick={() => navigate(`/profile/${post.Author.id}`)}
                />
              </div>
              <div
                className="flex w-full items-center text-self-pink-500 hover:text-self-pink-600"
                onClick={() => navigate(`/profile/${post.Author.id}`)}
              >
                <AiFillCheckCircle className="h-[14px] w-[14px]" />
                <p className="ml-0.5 cursor-pointer truncate overflow-ellipsis text-xs font-bold">
                  {post.Author.name}
                </p>
              </div>
            </div>
            <p
              className="w-40 cursor-pointer truncate text-xl font-bold hover:text-gray-200 md:w-48"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.title}
            </p>
            <p
              className="cursor-pointer truncate text-sm text-self-gray hover:text-zinc-600"
              onClick={() =>
                navigate(
                  `/posts/search?mode=category&type=id&target=${post.Category.id}`
                )
              }
            >
              {post.Category.name}
            </p>
          </div>
          <div className="flex flex-col items-start space-y-0.5 text-white">
            <div className="flex items-center justify-end space-x-1">
              <FiThumbsUp
                className="mb-0.5 w-4 cursor-pointer hover:text-gray-200"
                onClick={increaseThumbs}
              />
              <p className="text-right text-sm">{post.thumbs}</p>
            </div>
            <div className="flex items-center justify-end space-x-1">
              <FaRegCommentDots
                className="w-4 cursor-pointer hover:text-gray-200"
                onClick={() => navigate(`/posts/${post.id}`)}
              />
              <p className="text-right text-sm">{post.commentCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarouselItem;
