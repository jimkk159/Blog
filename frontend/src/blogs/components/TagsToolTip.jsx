import React from "react";

//Custom Component
import Tag from "../../shared/components/UI/Tag";
import ToolTip from "../../shared/components/UI/ToolTip";

//CSS
import classes from "./TagsToolTip.module.css";

function TagsToolTip({
  className,
  show,
  value,
  isAnimate,
  isDarkMode,
  topicTags,
  tags,
  onTag,
  onSearch
}) {
  const tagsToLower = tags.map((tag) => tag.toLowerCase());
  const tagsChoice = topicTags.map((topicTag, index) => {
    const topicToLower = topicTag.toLowerCase();
    if (
      !tagsToLower.includes(topicToLower) &&
      topicToLower.includes(value.toLowerCase())
    )
      return (
        <Tag
          key={index}
          tag={topicTag}
          isEdit
          isDarkMode={isDarkMode}
          onClick={() => {
            onTag(topicTag);
          }}
        />
      );
    else return null;
  });

  //Input Search
  const searchChangeHandler = (event) => {
    onSearch(event.target.value);
  };

  return (
    <ToolTip className={`${className}`} show={show} isAnimate={isAnimate}>
      <div
        className={`${classes["container"]} ${
          isDarkMode ? classes["container-dark"] : classes["container-light"]
        }`}
      >
        <input
          type="text"
          value={value}
          className={`${classes["tag-input"]} ${
            isDarkMode ? classes["input-dark"] : classes["input-light"]
          }`}
          placeholder={"Search..."}
          onChange={searchChangeHandler}
        />
        <hr className={`${classes["tag-hr"]}`} />
        <div
          className={`${classes["tags-container"]} ${
            isDarkMode ? classes["tags-dark"] : classes["tags-light"]
          }`}
        >
          {tagsChoice}
        </div>
      </div>
    </ToolTip>
  );
}

export default TagsToolTip;
