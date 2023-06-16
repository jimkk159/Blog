import { useMediaQuery } from "react-responsive";

// icons
import { AiFillCheckCircle } from "react-icons/ai";

// components
import Button from "../UI/Button";

function LiItem1({ title, content }) {
  return (
    <li className="flex h-full flex-col items-start justify-start md:pt-8">
      <h1 className="text-sm font-bold text-white">{title}</h1>
      <p className="line-clamp-2 w-28 overflow-ellipsis text-xs">{content}</p>
    </li>
  );
}

function LiItem2({ title, content }) {
  return (
    <li className="flex h-full flex-col items-start justify-start md:pt-8">
      <h1 className="text-sm font-bold text-white">{title}</h1>
      <p className="line-clamp-2 w-28 whitespace-nowrap text-xs">{content}</p>
    </li>
  );
}

function Tag({ name }) {
  return (
    <div>
      <p
        title={name}
        className="mt-2 max-h-5 min-w-[12px] max-w-[60px] cursor-pointer items-center truncate overflow-ellipsis rounded-2xl bg-gray-600 px-2 py-0.5 text-xs text-gray-50 hover:bg-gray-700"
      >
        {name}
      </p>
    </div>
  );
}

function TagList({ post }) {
  const tags = [];
  if (post.Category)
    tags.push(<Tag key={post.Category.name} name={post.Category.name} />);
  if (post.Tags)
    post.Tags.forEach((tag) =>
      tags.push(<Tag key={tag.name} name={tag.name} />)
    );
  return <div className="flex overflow-hidden space-x-1">{tags}</div>;
}

function PostListItem({ post }) {
  // import hooks
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });

  if (matches768)
    return (
      <div className="flex items-center justify-center border-b border-self-gray py-4">
        <ul className="flex h-full w-full space-x-4">
          <div className="h-32 w-32">
            <img
              className="h-32 w-32 min-w-[128px] rounded-3xl border border-self-gray object-cover"
              alt="preview"
              src={post.previewImg}
            />
          </div>
          <div className="flex w-full flex-col items-start justify-start">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex w-full">
                <AiFillCheckCircle className="h-[14px] w-[14px] text-self-pink-500" />
                <p className="ml-0.5 truncate overflow-ellipsis text-xs font-bold text-self-pink-500">
                  {post.Author.name}
                </p>
              </div>
              <p className="overflow-ellipsis whitespace-nowrap text-xs italic">
                {post.updatedAt}
              </p>
            </div>
            <div className="line-clamp-1 w-full overflow-ellipsis text-xl font-bold text-white">
              {post.title}
            </div>
            <div className="my-1 line-clamp-3 w-full flex-grow overflow-ellipsis pr-1 text-justify text-xs text-self-gray">
              {post.summary}
            </div>
            <TagList post={post} />
          </div>
          <div className="flex w-fit items-center justify-start">
            <Button
              type="button"
              //   disabled={isSubmitting}
              //   loading={true}
              className={
                "rounded-3xl border-2 border-self-gray bg-transparent px-8 py-2.5 text-self-gray shadow-xl " +
                "hover:border-self-pink-500 hover:text-self-pink-500"
              }
              spinner={{ color: "text-self-pink-500" }}
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
          className="h-28 w-28 min-w-[112px] rounded-3xl border border-self-gray object-cover"
          alt="preview"
          src={post.previewImg}
        />
      </div>
      <div className="flex h-28 w-full flex-col items-start space-y-2 ">
        <div className="flex h-full w-full flex-col items-start justify-start ">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex w-full">
              <AiFillCheckCircle className="h-[14px] w-[14px] text-self-pink-500" />
              <p className="ml-0.5 truncate overflow-ellipsis text-xs font-bold text-self-pink-500">
                {post.Author.name}
              </p>
            </div>
            <p className="overflow-ellipsis whitespace-nowrap text-xs italic">
              {post.updatedAt}
            </p>
          </div>
          <div className="line-clamp-1 w-full overflow-ellipsis pr-16 text-sm font-bold text-white">
            {post.title}
          </div>
          <div className="line-clamp-2 w-full overflow-ellipsis pr-16 text-xs text-self-gray">
            {post.summary}
          </div>
        </div>
        <div className="flex w-full justify-between pt-2">
          <Tag name={post.Category.name} />
          <Button
            type="button"
            //   disabled={isSubmitting}
            //   loading={true}
            className={
              "rounded-3xl border-2 border-self-gray bg-transparent px-3 py-1 text-self-gray shadow-xl " +
              "hover:border-self-pink-500 hover:text-self-pink-500"
            }
            textProps={{ className: "px-0 text-xs" }}
            spinner={{ color: "text-self-pink-500" }}
          >
            Browse
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PostListItem;
