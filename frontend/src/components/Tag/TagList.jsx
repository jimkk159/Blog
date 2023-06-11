import { Link } from "react-router-dom";
import { AiOutlineTag } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";

import TagsToolTip from "./TagsToolTip";
import { tagActions } from "../../store/tag-slice";
import { useEffect } from "react";

function TagList({ post, title, isEdit = false }) {
  const dispatch = useDispatch();
  const current = useSelector((state) => state.tag.tags);

  useEffect(() => {
    return () => dispatch(tagActions.reset());
  }, [dispatch]);

  if (!isEdit && !post) return;

  let categoryTag = post ? (
    <p className=" m-1 max-h-5 min-w-[20px] max-w-[100px] items-center truncate rounded-2xl bg-gray-600 p-0.5 px-3 text-[4px] text-gray-50 hover:bg-gray-700">
      {`${post.Category && post.Category.name}`}
    </p>
  ) : null;

  let otherTags = current
    .filter((tag) => {
      if (!post) return true;
      return tag.name !== post.Category.name;
    })
    .map((tag, index) => (
      <p
        key={index}
        onClick={() => dispatch(tagActions.remove({ id: tag.id }))}
        className="m-1 max-h-5 min-w-[20px] max-w-[100px] items-center truncate rounded-2xl bg-gray-600 p-0.5 px-3 text-[4px] text-gray-50 hover:bg-gray-700"
      >
        {tag.name}
      </p>
    ));

  if (!isEdit) {
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

  if (!post) {
    return (
      <div className="text-md mt-2 flex flex-wrap items-center">
        <AiOutlineTag className="mr-1 h-[20px] w-[20px]" />
        {otherTags}
        {isEdit && <TagsToolTip isNew />}
      </div>
    );
  }

  return (
    <div className="text-md mt-2 flex flex-wrap items-center">
      <AiOutlineTag className="mr-1 h-[20px] w-[20px]" />
      {categoryTag}
      {otherTags}
      {isEdit && <TagsToolTip postTags={post.Tags} category={post.Category} />}
    </div>
  );
}

export default TagList;
