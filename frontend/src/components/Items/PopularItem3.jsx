// icons
import { FiThumbsUp } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";

// custom functions
import { creatPreviewImg } from "../../utils/helper";

function PopularItem3({ post }) {
  return (
    <div className="box-border flex w-full flex-col space-y-4 rounded-3xl border-2 border-zinc-600 bg-self-dark-gray px-4 py-8 text-white">
      <div className="flex w-full items-center justify-center">
        <img
          title={post.title}
          alt="preview"
          className="h-40 w-full rounded-3xl object-cover lg:max-h-[160px]"
          src={creatPreviewImg(post.previewImg)}
        />
      </div>
      <div className="flex h-full w-full flex-col justify-between">
        <div>
          <div className="flex items-end justify-between space-x-1">
            <h1 className="line-clamp-1 overflow-hidden text-xl font-bold md:pr-36 md:text-2xl lg:pr-0 lg:text-base">
              {post.title}
            </h1>
          </div>
          <p className="text-sm text-self-gray md:text-base lg:text-sm">
            {post.Category.name}
          </p>
        </div>
        <div className="flex justify-end space-x-2 md:space-x-8 lg:space-x-2">
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
  );
}
export default PopularItem3;
