// icons
import { AiFillCheckCircle } from "react-icons/ai";

// components
import Avatar from "../UI/Avatar";

function PopularPostItem({ post }) {
  return (
    <div className="box-border flex w-full flex-col space-y-4 rounded-3xl border-2 border-zinc-600  p-4 text-white">
      <div className="flex w-full items-center justify-center">
        <img
          title={post.title}
          alt="preview"
          className="h-[264px] w-full rounded-3xl object-cover lg:max-h-[160px]"
          src={post.previewImg}
        />
      </div>
      <div className="flex h-full justify-between space-x-4">
        <div className="flex h-full justify-start">
          <Avatar
            avatar={post.Author.avatar}
            title={post.Author.name}
            className={"h-10 w-10 border-2 border-white"}
          />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-1 text-sm text-self-pink-500 ">
            <AiFillCheckCircle className="h-4 w-4" />
            <p className="w-fit truncate">{post.Author.name}</p>
          </div>
          <h1 className="line-clamp-2 h-14 w-fit text-xl font-bold capitalize">
            {post.title}
          </h1>
        </div>
      </div>
    </div>
  );
}
export default PopularPostItem;
