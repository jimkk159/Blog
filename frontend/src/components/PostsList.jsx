import Pagination from "./UI/Pagination";
import MDEditor from "@uiw/react-md-editor";
import { AiOutlineTag } from "react-icons/ai";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Avatar from "../components/UI/Avatar";

const defaultPage = 1;
const defaultLimit = 15;

const formDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function TagList({ post }) {
  if (!post) return;
  return (
    <div className="text-md mt-2 flex items-center">
      <AiOutlineTag className="mr-1 h-[20px] w-[20px]" />
      <p className="m-1 flex min-w-[20px] cursor-pointer items-center rounded-2xl bg-gray-600 px-3 text-gray-50">
        <Link
          className="p-0.5 text-[4px]"
          key="category"
          to={`/search?mode=category&type=id&target=${post.Category.id}`}
        >{`${post.Category && post.Category.name}`}</Link>
      </p>
      {post.Tags.filter((tag) => tag.name !== post.Category.name).map(
        (tag, index) => (
          <p className="m-1 flex min-w-[20px] cursor-pointer items-center rounded-2xl bg-gray-600 px-3 text-gray-50">
            <Link
              className="p-0.5 text-[4px]"
              key={index}
              to={`/search?mode=tag&type=id&target=${tag.id}`}
            >
              {tag.name}
            </Link>
          </p>
        )
      )}
    </div>
  );
}

function TagListSmall({ post }) {
  if (!post) return;
  return (
    <div className="flex w-full justify-start text-xs">
      <AiOutlineTag className="mr-1 h-4 w-4" />
      <p className="mx-0.5 flex min-w-[10px] cursor-pointer items-center rounded-2xl bg-gray-600 px-3 text-gray-50">
        <Link
          className="text-[4px]"
          key="category"
          to={`/search?mode=category&type=id&target=${post.Category.id}`}
        >{`${post.Category && post.Category.name}`}</Link>
      </p>
      {post.Tags.filter((tag) => tag.name !== post.Category.name).map(
        (tag, index) => (
          <p className="mx-0.5 flex min-w-[10px] cursor-pointer items-center rounded-2xl bg-gray-600 px-3 text-gray-50">
            <Link
              className="text-[4px]"
              key={index}
              to={`/search?mode=tag&type=id&target=${tag.id}`}
            >
              {tag.name}
            </Link>
          </p>
        )
      )}
    </div>
  );
}

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
                        className={"h-[28px] w-[28px]"}
                        avatar={post.Author.avatar}
                        onClick={() => navigate(`/profile/${post.Author.id}`)}
                      />
                      <Link
                        to={`/profile/${post.Author.id}`}
                        className="text-[14px] font-bold leading-none"
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
              <div
                className={`truncate font-kanit font-bold ${
                  small ? "py-0.5 text-base" : "py-1 text-xl "
                }`}
              >
                <Link to={`/${post.id}`}>{`${post.title}`}</Link>
              </div>
              <div className="w-full overflow-hidden rounded-xl bg-green-600"></div>
              {isShowDescription && (
                <MDEditor.Markdown
                  source={post.content}
                  className="h-24 resize-none overflow-hidden overflow-ellipsis whitespace-pre-wrap text-justify border-2 p-2"
                />
              )}
              {!isTagOnTopRight && <TagList post={post} />}
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
