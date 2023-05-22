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

function PostList({ posts, total, onNavPage }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") ?? defaultPage;
  const limit = searchParams.get("limit") ?? defaultLimit;

  if (!posts)
    return (
      <div className="flex flex-col">
        <ul className="w-full max-w-5xl"></ul>
      </div>
    );

  return (
    <div className="inline-flex w-full flex-col justify-center">
      <ul className="w-full max-w-5xl">
        {posts.map((post, index) => (
          <li
            key={index}
            className="m-4 flex flex-col rounded bg-gray-100 p-4 text-black"
          >
            {post.Author && (
              <div className="flex items-end gap-3">
                <Avatar
                  className={"h-[28px] w-[28px]"}
                  onClick={() => navigate(`/profile/${post.Author.id}`)}
                />
                <Link
                  to={`/profile/${post.Author.id}`}
                  className="text-[14px] font-bold leading-none"
                >
                  {`${post.Author.name}`}
                </Link>
                <p className="-ml-1 cursor-default font-akaya text-[12px] leading-none">
                  {formDate(post?.updatedAt)}
                </p>
              </div>
            )}
            <div className="truncate py-1 font-kanit text-xl font-bold">
              <Link to={`/${post.id}`}>{`${post.title}`}</Link>
            </div>
            <div className="w-full overflow-hidden rounded-xl bg-green-600"></div>
            <MDEditor.Markdown
              source={post.content}
              className="h-16 resize-none overflow-hidden overflow-ellipsis whitespace-pre-wrap text-justify"
            />
            <div className="text-bmd mt-2 flex items-center">
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
          </li>
        ))}
      </ul>
      <div className="w-full max-w-5xl">
        <Pagination
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
