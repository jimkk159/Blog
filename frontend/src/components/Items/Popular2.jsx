import { useNavigate } from "react-router-dom";

// icons
import { AiFillCheckCircle } from "react-icons/ai";

// components
import Avatar from "../UI/Avatar";

// custom functions
import { creatPreviewImg } from "../../utils/helper";

function PopularItem2({ post }) {
  const navigate = useNavigate();

  return (
    <div className="px-2">
      <div className="box-border flex w-full flex-col space-y-4 rounded-3xl border-2 border-zinc-600 px-2 py-4 text-white md:px-4">
        <div className="flex w-full items-center justify-center">
          <img
            title={post.title}
            alt="preview"
            className="h-[264px] w-full cursor-pointer rounded-3xl object-cover md:h-28 lg:max-h-[160px]"
            src={creatPreviewImg(post.previewImg)}
            onClick={() => navigate(`/posts/${post.id}`)}
          />
        </div>
        <div className="flex h-full justify-between space-x-4">
          <div
            className="flex h-full cursor-pointer justify-start hover:opacity-90"
            onClick={() => navigate(`/profile/${post.Author.id}`)}
          >
            <Avatar
              avatar={post.Author.avatar}
              title={post.Author.name}
              className={"h-10 w-10 border-2 border-white md:h-8 md:w-8"}
            />
          </div>
          <div className="flex w-full flex-col items-start space-y-0.5 overflow-hidden">
            <div
              className="flex cursor-pointer items-center space-x-1 text-sm text-self-pink-500 hover:text-self-pink-600"
              onClick={() => navigate(`/profile/${post.Author.id}`)}
            >
              <AiFillCheckCircle className="h-4 w-4" />
              <p className="w-fit truncate">{post.Author.name}</p>
            </div>
            <h1
              className="line-clamp-2 h-14 w-fit cursor-pointer text-xl font-bold capitalize hover:text-gray-200 md:h-10 md:text-base"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PopularItem2;
