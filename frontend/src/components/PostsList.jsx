import Pagination from "./UI/Pagination";
import MDEditor from "@uiw/react-md-editor";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import TagList from "./TagList";
import TagListSmall from "./TagListSmall";
import Avatar from "../components/UI/Avatar";

const defaultPage = 1;
const defaultLimit = 15;

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
  isShowDescription = true,
  isShowAuthor = true,
  isTagOnTopRight = false,
  small = false,
  page: inputPage,
  limit: inputLimit,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = inputPage ?? searchParams.get("page") ?? defaultPage;
  const limit = inputLimit ?? searchParams.get("limit") ?? defaultLimit;

  if (!posts)
    return (
      <div className="flex flex-col">
        <ul className="w-full max-w-5xl"></ul>
      </div>
    );

  return (
    <div className="inline-flex w-full flex-col justify-start">
      <ul className="w-full max-w-5xl">
        {posts.map((post, index) => {
          return (
            <li
              key={index}
              className={`flex flex-col rounded bg-gray-100 text-black ${
                small ? "m-1 px-3 py-2" : "m-4 p-4"
              }`}
            >
              {post.Author && (
                <div className="flex items-end gap-3">
                  {isShowAuthor && (
                    <>
                      <Avatar
                        title="To author profile"
                        className={`h-[28px] w-[28px] cursor-pointer hover:bg-gray-950`}
                        avatar={post.Author.avatar}
                        onClick={() => navigate(`/profile/${post.Author.id}`)}
                      />
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
              <Link title="To post" to={`/${post.id}`}>
                <p
                  className={`truncate font-kanit font-bold hover:text-gray-900 ${
                    small ? "py-0.5 text-base" : "py-1 text-xl "
                  }`}
                >
                  {`${post.title}`}
                </p>
                {isShowDescription && (
                  <MDEditor.Markdown
                    source={post.content}
                    className="h-24 resize-none overflow-hidden overflow-ellipsis whitespace-pre-wrap border-2 p-2 text-justify"
                  />
                )}
              </Link>
              {!isTagOnTopRight && (
                <TagList post={post} title="Search for this tag?" className={""} />
              )}
            </li>
          );
        })}
      </ul>
      <div className="w-full max-w-5xl">
        <Pagination
          small={small}
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
