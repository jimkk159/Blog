import { AiOutlineTag } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useNavigation } from "react-router-dom";

// components
import Button from "../UI/Button";

// custom functions
import { creatPreviewImg } from "../../utils/helper";

// helper
import * as helper from "../../utils/helper";

function Tag({ name, mode, type, target }) {
  const navigate = useNavigate();

  return (
    <div>
      <p
        title={name}
        className="min-w-[8px] max-w-[60px] cursor-pointer items-center truncate overflow-ellipsis rounded-2xl bg-gray-600 px-2 text-xs text-gray-50 hover:bg-gray-700 lg:max-w-[200px]"
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
    <div className="flex space-x-0.5 overflow-hidden">
      <AiOutlineTag className="mr-1 h-[16px] w-[16px]" />
      <div className="flex w-full max-w-[300px] space-x-0.5 overflow-hidden">
        {tags}
      </div>
    </div>
  );
}

function PostListItem3({ post }) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // import hooks
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });

  if (matches768)
    return (
      <div className="flex w-full items-start justify-start border-b border-self-gray py-2">
        <div className="flex h-full w-full space-x-3">
          <div className="flex h-20 w-20 flex-col items-center justify-center">
            <img
              className="h-20 w-20 min-w-[80px] cursor-pointer rounded-3xl border border-self-gray object-cover"
              alt="preview"
              src={creatPreviewImg(post.previewImg)}
              onClick={() => navigate(`/posts/${post.id}`)}
            />
          </div>
          <div className="flex w-full flex-col items-start">
            <div className="flex h-full w-full flex-col items-start justify-start ">
              <p className="overflow-ellipsis whitespace-nowrap text-xs italic text-self-gray">
                {helper.formatDate(post.editedAt)}
              </p>
              <div
                className="line-clamp-1 w-full cursor-pointer overflow-ellipsis pr-16 text-2xl font-bold text-white hover:text-gray-200"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {post.title}
              </div>
              <div
                className="line-clamp-2 w-full cursor-pointer overflow-ellipsis pr-4 text-xs text-self-gray hover:text-zinc-500"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {post.summary}
              </div>
            </div>
            <div className="flex w-full justify-between space-x-4 pt-2">
              <TagList post={post} />
            </div>
          </div>
          <div className="flex w-fit items-center justify-center">
            <Button
              type="button"
              disabled={isSubmitting}
              loading={isSubmitting}
              className={
                "rounded-3xl border-2 border-self-gray bg-transparent px-3 py-1 text-self-gray shadow-xl " +
                "hover:border-self-pink-500 hover:text-self-pink-500"
              }
              textProps={{}}
              spinner={{ color: "text-self-pink-500" }}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              Browse
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex items-center justify-center border-b border-self-gray py-2">
      <div className="flex h-full w-full space-x-2">
        <div className="h-12 w-12">
          <img
            className="h-12 w-12 min-w-[48px] cursor-pointer rounded-lg border border-self-gray object-cover"
            alt="preview"
            src={creatPreviewImg(post.previewImg)}
            onClick={() => navigate(`/posts/${post.id}`)}
          />
        </div>
        <div className="flex w-full flex-col items-start justify-start overflow-hidden">
          <div className="flex space-x-3">
            <p className="overflow-ellipsis whitespace-nowrap text-xs italic text-self-gray">
              {helper.formatDate(post.editedAt)}
            </p>
            <TagList post={post} />
          </div>
          <div
            className="line-clamp-1 w-full cursor-pointer overflow-ellipsis text-xl font-bold text-white hover:text-gray-200"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            {post.title}
          </div>
        </div>
        <div className="flex w-fit items-center justify-start">
          <Button
            type="button"
            disabled={isSubmitting}
            loading={isSubmitting}
            className={
              "rounded-3xl border-2 border-self-gray bg-transparent px-2 py-0.5 text-self-gray shadow-xl " +
              "hover:border-self-pink-500 hover:text-self-pink-500"
            }
            spinner={{ color: "text-self-pink-500" }}
            onClick={() => navigate(`/posts/${post.id}`)}
            textProps={{ className: "text-xs" }}
          >
            Browse
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PostListItem3;
