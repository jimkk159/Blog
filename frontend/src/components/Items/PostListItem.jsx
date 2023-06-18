import { AiOutlineTag } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useNavigation } from "react-router-dom";

// icons
import { AiFillCheckCircle } from "react-icons/ai";

// components
import Avatar from "../UI/Avatar";
import Button from "../UI/Button";

// custom functions
import { creatPreviewImg } from "../../utils/helper";

// helper
import { formatDate } from "../../utils/helper";

function Tag({ name, mode, type, target }) {
  const navigate = useNavigate();

  return (
    <div>
      <p
        title={name}
        className="mt-2 max-h-5 min-w-[12px] max-w-[60px] cursor-pointer items-center truncate overflow-ellipsis rounded-2xl bg-gray-600 px-2 py-0.5 text-xs text-gray-50 hover:bg-gray-700 lg:max-w-[200px]"
        onClick={() =>
          navigate(`/posts/search?mode=${mode}&type=${type}&target=${target}`)
        }
      >
        {name}
      </p>
    </div>
  );
}

function TagList({ post }) {
  const tags = [];
  if (post.Category) {
    const props = {
      key: "category:" + post.Category.name,
      name: post.Category.name,
      mode: "category",
      type: "id",
      target: post.Category.id,
    };

    tags.push(<Tag {...props} />);
  }

  if (post.Tags)
    post.Tags.forEach((tag) => {
      const props = {
        key: "tag:" + tag.name,
        name: tag.name,
        mode: "tag",
        type: "id",
        target: tag.id,
      };
      tags.push(<Tag {...props} />);
    });

  return (
    <div className="flex space-x-1 overflow-hidden">
      <AiOutlineTag className="mr-1 mt-2 h-[20px] w-[20px]" />
      {tags}
    </div>
  );
}

function PostListItem({ post }) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // import hooks
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });

  if (matches768)
    return (
      <div className="flex items-center justify-center border-b border-self-gray py-4">
        <ul className="flex h-full w-full space-x-4">
          <div className="h-32 w-32">
            <img
              className="h-32 w-32 min-w-[128px] cursor-pointer rounded-3xl border border-self-gray object-cover"
              alt="preview"
              src={creatPreviewImg(post.previewImg)}
              onClick={() => navigate(`/posts/${post.id}`)}
            />
          </div>
          <div className="flex w-full flex-col items-start justify-start">
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
              <p className="overflow-ellipsis whitespace-nowrap text-xs italic">
                {formatDate(post.editedAt)}
              </p>
            </div>
            <div
              className="line-clamp-1 w-full cursor-pointer overflow-ellipsis text-xl font-bold text-white hover:text-gray-200"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.title}
            </div>
            <div
              className="my-1 line-clamp-3 w-full flex-grow cursor-pointer overflow-ellipsis pr-1 text-justify text-xs text-self-gray hover:text-zinc-500"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {post.summary}
            </div>
            <TagList post={post} />
          </div>
          <div className="flex w-fit items-center justify-start">
            <Button
              type="button"
              disabled={isSubmitting}
              loading={isSubmitting}
              className={
                "rounded-3xl border-2 border-self-gray bg-transparent px-8 py-2.5 text-self-gray shadow-xl " +
                "hover:border-self-pink-500 hover:text-self-pink-500"
              }
              spinner={{ color: "text-self-pink-500" }}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              Browse
            </Button>
          </div>
        </ul>
      </div>
    );

  return (
    <div className="flex w-full items-start justify-start space-x-4 border-b border-self-gray py-2">
      <div className="flex h-28 w-28 flex-col items-center justify-center">
        <img
          className="h-28 w-28 min-w-[112px] cursor-pointer rounded-3xl border border-self-gray object-cover"
          alt="preview"
          src={creatPreviewImg(post.previewImg)}
          onClick={() => navigate(`/posts/${post.id}`)}
        />
      </div>
      <div className="flex h-28 w-full flex-col items-start space-y-2 ">
        <div className="flex h-full w-full flex-col items-start justify-start ">
          <div className="flex items-center justify-center space-x-2">
            <div>
              <Avatar
                title="To author profile"
                className={`h-4 w-4 cursor-pointer border border-gray-500`}
                avatar={post.Author.avatar}
                onClick={() => navigate(`/profile/${post.Author.id}`)}
              />
            </div>
            <div
              className="flex w-full cursor-pointer items-center text-self-pink-500 hover:text-self-pink-600"
              onClick={() => navigate(`/profile/${post.Author.id}`)}
            >
              <AiFillCheckCircle className="h-[14px] w-[14px]" />
              <p className="ml-0.5 w-20 truncate overflow-ellipsis text-xs font-bold">
                {post.Author.name}
              </p>
            </div>
            <p className="overflow-ellipsis whitespace-nowrap text-xs italic">
              {formatDate(post.editedAt)}
            </p>
          </div>
          <div
            className="line-clamp-1 w-full cursor-pointer overflow-ellipsis pr-16 text-sm font-bold text-white hover:text-gray-200"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            {post.title}
          </div>
          <div
            className="line-clamp-2 w-full cursor-pointer pr-4 overflow-ellipsis text-xs text-self-gray hover:text-zinc-500"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            {post.summary}
          </div>
        </div>
        <div className="flex w-full justify-between pt-2 space-x-4">
          <Tag
            name={post.Category.name}
            mode={"category"}
            type={"id"}
            target={post.Category.id}
          />
          <Button
            type="button"
            disabled={isSubmitting}
            loading={isSubmitting}
            className={
              "rounded-3xl border-2 border-self-gray bg-transparent px-3 py-1 text-self-gray shadow-xl " +
              "hover:border-self-pink-500 hover:text-self-pink-500"
            }
            textProps={{ className: "px-0 text-xs" }}
            spinner={{ color: "text-self-pink-500" }}
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            Browse
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PostListItem;
