import { Link } from "react-router-dom";
import { AiOutlineTag } from "react-icons/ai";

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

export default TagList;
