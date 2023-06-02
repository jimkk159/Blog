import { Link } from "react-router-dom";
import { AiOutlineTag } from "react-icons/ai";

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

export default TagListSmall;
