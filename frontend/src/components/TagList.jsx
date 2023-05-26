import { Link } from "react-router-dom";
import { AiOutlineTag } from "react-icons/ai";

function TagList({ post, title, isClickable = true }) {
  if (!post) return;

  let categoryTag = (
    <p className="m-1 flex min-w-[20px] items-center rounded-2xl bg-gray-600 p-0.5 px-3 text-[4px] text-gray-50 hover:bg-gray-700">
      {`${post.Category && post.Category.name}`}
    </p>
  );

  let otherTags = post.Tags.filter(
    (tag) => tag.name !== post.Category.name
  ).map((tag) => (
    <p className="m-1 flex min-w-[20px] items-center rounded-2xl bg-gray-600 p-0.5 px-3 text-[4px] text-gray-50 hover:bg-gray-700">
      {tag.name}
    </p>
  ));

  if (isClickable) {
    categoryTag = (
      <Link
        title={title}
        key="category"
        className="cursor-pointer"
        to={`/search?mode=category&type=id&target=${post.Category.id}`}
      >
        {categoryTag}
      </Link>
    );

    otherTags = post.Tags.filter((tag) => tag.name !== post.Category.name).map(
      (tag, index) => (
        <Link
          key={index}
          title={title}
          className="cursor-pointer"
          to={`/search?mode=tag&type=id&target=${tag.id}`}
        >
          <p className="m-1 flex min-w-[20px] cursor-pointer items-center rounded-2xl bg-gray-600 p-0.5 px-3 text-[4px] text-gray-50 hover:bg-gray-700">
            {tag.name}
          </p>
        </Link>
      )
    );
  }

  return (
    <div className="text-md mt-2 flex items-center">
      <AiOutlineTag className="mr-1 h-[20px] w-[20px]" />
      {categoryTag}
      {otherTags}
    </div>
  );
}

export default TagList;
