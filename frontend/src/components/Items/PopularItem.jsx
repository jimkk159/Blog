// icons
import { AiFillCheckCircle } from "react-icons/ai";

import { useNavigate } from "react-router-dom";

// components
import Avatar from "../UI/Avatar";

function PopularItem({ post }) {
  const navigate = useNavigate();
  return (
    <div className="box-border flex w-full flex-col space-y-4 rounded-3xl border-2 border-zinc-600 p-4 text-white">
      <div className="flex w-full items-center justify-center">
        <img
          title={post.title}
          alt="preview"
          className="h-[264px] w-full cursor-pointer rounded-3xl object-cover lg:max-h-[160px]"
          src={post.previewImg}
          onClick={() => navigate(`/posts/${post.id}`)}
        />
      </div>
      <div className="flex h-full justify-between space-x-4 overflow-hidden">
        <div
          className="flex h-full cursor-pointer justify-start hover:opacity-90"
          onClick={() => navigate(`/profile/${post.Author.id}`)}
        >
          <Avatar
            avatar={post.Author.avatar}
            title={post.Author.name}
            className={"h-10 w-10 border-2 border-white"}
          />
        </div>
        <div className="flex w-full flex-col items-start space-y-1">
          <div
            className="flex cursor-pointer items-center space-x-1 text-sm text-self-pink-500 hover:text-self-pink-600"
            onClick={() => navigate(`/profile/${post.Author.id}`)}
          >
            <AiFillCheckCircle className="h-4 w-4" />
            <p className="w-fit truncate">{post.Author.name}</p>
          </div>
          <h1
            className="line-clamp-2 h-14 w-fit cursor-pointer text-xl font-bold capitalize hover:text-gray-200"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            {post.title}
          </h1>
        </div>
      </div>
    </div>
  );
}
export default PopularItem;
