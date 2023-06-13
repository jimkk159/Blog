import Pagination from "../UI/Pagination";
import MDEditor from "@uiw/react-md-editor";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Avatar from "../UI/Avatar";
import TagList from "../Tag/TagList";
import TagListSmall from "../Tag/TagListSmall";

const defaultPage = 1;
const defaultLimit = 15;

// reducer
const formDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function PostList({
  posts,
  total,
  onNavPage,
  size = "normal",
  page: inputPage,
  limit: inputLimit,
  isShowAuthor = true,
  isTagOnTopRight = false,
  isShowDescription = true,
}) {
  // react-router
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = inputPage ?? searchParams.get("page") ?? defaultPage;
  const limit = inputLimit ?? searchParams.get("limit") ?? defaultLimit;

  // modify css when query size change
  let liCSS = "";
  let titleCSS = "";
  switch (size) {
    case "xs":
      liCSS = "m-1 px-1 pt-1.5 py-0.5";
      titleCSS = "py-0.25 text-sm";
      break;
    case "small":
      liCSS = "m-1 px-3 py-2";
      titleCSS = "py-0.5 text-base";
      break;
    default:
      liCSS = "m-4 p-4 hover:p-[17px] hover:m-[15px]";
      titleCSS = "py-1 text-xl";
  }

  if (!posts)
    return (
      <div className="flex flex-col">
        <ul className="w-full max-w-5xl"></ul>
      </div>
    );

  return (
    <div className="inline-flex h-full w-full flex-col items-center">
      <ul className="w-full max-w-5xl">
        {posts.map((post, index) => {
          return (
            <li
              key={index}
              className={`flex flex-col rounded bg-white text-black ${liCSS}`}
            >
              {post.Author && (
                <div className="flex items-end gap-3 px-0.5">
                  {isShowAuthor && (
                    <>
                      <div>
                        <Avatar
                          title="To author profile"
                          className={`h-[30px] w-[30px] cursor-pointer border border-gray-500`}
                          avatar={post.Author.avatar}
                          onClick={() => navigate(`/profile/${post.Author.id}`)}
                        />
                      </div>
                      <Link
                        title="To author profile"
                        to={`/profile/${post.Author.id}`}
                        className="text-[14px] font-bold leading-none hover:text-gray-800"
                      >
                        {`${post.Author.name}`}
                      </Link>
                    </>
                  )}
                  <p
                    className={`cursor-default whitespace-nowrap font-akaya text-[12px] leading-none ${
                      isShowAuthor && "-ml-1 "
                    }`}
                  >
                    {formDate(post?.updatedAt)}
                  </p>
                  {isTagOnTopRight && <TagListSmall post={post} />}
                </div>
              )}
              <Link title="To post" to={`/posts/${post.id}`}>
                <p
                  className={`truncate px-1 font-kanit font-bold hover:text-gray-900 ${titleCSS}`}
                >
                  {`${post.title}`}
                </p>
                {isShowDescription && (
                  <MDEditor.Markdown
                    source={post.content}
                    className="h-40 resize-none overflow-hidden overflow-ellipsis whitespace-pre-wrap border-2 p-2 text-justify md:h-24"
                  />
                )}
              </Link>
              {!isTagOnTopRight && (
                <TagList post={post} title="Search for this tag?" />
              )}
            </li>
          );
        })}
      </ul>
      <div className="w-full max-w-5xl">
        <Pagination
          size={size}
          total={total}
          current={page}
          limit={limit}
          onNavPage={onNavPage}
        />
      </div>
    </div>
  );
}

export default PostList;
