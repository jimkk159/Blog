import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { FiThumbsUp } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";

import * as authHelper from "../../utils/auth";

function TopPostItem2({ post }) {
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
    <li>
      <div className="flex h-full w-full flex-col space-y-6 text-white">
        <div className="flex h-20 min-h-[80px] items-stretch justify-between space-x-4 md:h-32 md:space-x-6 lg:h-20 lg:space-x-3">
          <div className="flex w-32 items-center justify-center md:w-44 lg:w-32">
            <img
              alt="preview"
              className="h-full w-full cursor-pointer overflow-hidden rounded-3xl object-cover opacity-90"
              src={post.previewImg}
              onClick={() => navigate(`/posts/${post.id}`)}
            />
          </div>
          <div className="flex h-full w-full flex-col justify-between lg:max-w-[120px]">
            <div className="flex w-full items-end justify-between space-x-1">
              <h1
                className="line-clamp-1 cursor-pointer overflow-hidden text-xl font-bold hover:text-gray-200 md:pr-36 md:text-2xl lg:pr-0 lg:text-base"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {post.title}
              </h1>
            </div>
            <p
              className="w-full cursor-pointer text-sm text-self-gray hover:text-zinc-600 md:text-base lg:text-sm"
              onClick={() =>
                navigate(
                  `/posts/search?mode=category&type=id&target=${post.Category.id}`
                )
              }
            >
              {post.Category.name}
            </p>
            <div className="flex w-full justify-end space-x-2 text-white md:space-x-8 lg:space-x-2">
              <div className="flex cursor-pointer items-center justify-end space-x-1 md:space-x-1.5 lg:space-x-1">
                <FiThumbsUp
                  className="mb-0.5 w-4 hover:text-gray-300 md:h-8 md:w-8 lg:mb-0.5 lg:w-4"
                  onClick={increaseThumbs}
                />
                <p className="text-right text-sm md:text-2xl lg:text-sm">
                  {post.thumbs}
                </p>
              </div>
              <div className="flex cursor-pointer items-center justify-end space-x-1 md:space-x-1.5 lg:space-x-1">
                <FaRegCommentDots className="mb-1 w-4  hover:text-gray-300 md:h-8 md:w-8 lg:mb-0.5 lg:w-4" />
                <p className="text-right text-sm md:text-2xl lg:text-sm">
                  {post.comments && post.comments.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
export default TopPostItem2;
