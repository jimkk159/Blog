import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineTag } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";

import TagsToolTip from "./TagsToolTip";
import { tagActions } from "../../store/tag-slice";

function TagList({
  post,
  isEditMode = false,
  isEdit = false,
  onClose,
  onToggle,
}) {
  let categoryTag = post ? (
    <p className=" m-1 max-h-5 min-w-[20px] max-w-[100px] items-center truncate rounded-2xl bg-gray-600 p-0.5 px-3 text-[4px] text-gray-50 hover:bg-gray-700">
      {`${post.Category && post.Category.name}`}
    </p>
  ) : null;

  // redux
  const dispatch = useDispatch();
  const current = useSelector((state) => state.tag.tags);
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

  // useEffect
  useEffect(() => {
    return () => dispatch(tagActions.reset());
  }, [dispatch]);

  if (!isEditMode && !post) return;

  if (!isEditMode) {
    categoryTag = (
      <Link
        title={post.Category.name}
        key="category"
        className="cursor-pointer"
        to={`/posts/search?mode=category&type=id&target=${post.Category.id}`}
      >
        {categoryTag}
      </Link>
    );

    otherTags = post.Tags.filter((tag) => tag.name !== post.Category.name).map(
      (tag, index) => (
        <Link
          key={index}
          title={tag.name}
          className="cursor-pointer"
          to={`/posts/search?mode=tag&type=id&target=${tag.id}`}
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
        {isEditMode && (
          <TagsToolTip
            isNew
            isEdit={isEdit}
            onClose={onClose}
            onToggle={onToggle}
          />
        )}
      </div>
    );
  }

  return (
    <div className="text-md mt-2 flex flex-wrap items-center">
      <AiOutlineTag className="mr-1 h-[20px] w-[20px]" />
      {categoryTag}
      {otherTags}
      {isEditMode && (
        <TagsToolTip
          postTags={post.Tags}
          category={post.Category}
          isEdit={isEdit}
          onClose={onClose}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

export default TagList;
