import { FiThumbsUp } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";

function TopPostItem({ post }) {
  return (
    <li>
      <div className="flex h-full w-full flex-col space-y-6 text-white">
        <div className="flex h-20 min-h-[80px] items-stretch justify-between space-x-4 md:h-32 md:space-x-6 lg:h-20 lg:space-x-3">
          <div className="flex w-32 items-center justify-center md:w-44 lg:w-28">
            <img
              alt="preview"
              className="h-full w-full overflow-hidden rounded-3xl object-cover"
              src={post.previewImg}
            />
          </div>
          <div className="flex h-full w-full max-w-[120px] flex-col justify-between">
            <div className="flex items-end justify-between space-x-1">
              <h1 className="line-clamp-1 overflow-hidden text-xl font-bold md:pr-36 md:text-2xl lg:pr-0 lg:text-base">
                {post.title}
              </h1>
            </div>
            <p className="text-sm text-self-gray md:text-base lg:text-sm">
              {post.Category.name}
            </p>
            <div className="flex w-full justify-end space-x-2 md:space-x-8 lg:space-x-2">
              <div className="flex items-center justify-end space-x-1 md:space-x-1.5 lg:space-x-1">
                <FiThumbsUp className="mb-0.5 w-4 md:h-8 md:w-8 lg:mb-0.5 lg:w-4" />
                <p className="text-right text-sm md:text-2xl lg:text-sm">
                  {post.thumbs}
                </p>
              </div>
              <div className="flex items-center justify-end space-x-1 md:space-x-1.5 lg:space-x-1">
                <FaRegCommentDots className="mb-1 w-4 text-white md:h-8 md:w-8 lg:mb-0.5 lg:w-4" />
                <p className="text-right text-sm md:text-2xl lg:text-sm">
                  {post.comments}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
export default TopPostItem;
