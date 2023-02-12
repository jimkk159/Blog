import React from "react";

//Icon
import { AiOutlineTag } from "react-icons/ai";

//Custom Component
import Tag from "./Tag";

//CSS
import classes from "./Tags.module.css";

function Tags({
  isEdit,
  isDarkMode,
  content,
  editContent,
  onKeyDown,
  onRemove,
}) {

  return (
    <div className={classes["detail-bottom"]}>
      <AiOutlineTag className={classes["icon"]} />
      {content?.map((tag, index) => (
        <Tag
          key={index}
          tag={tag}
          isDarkMode={isDarkMode}
          isEdit={isEdit}
          onClick={() => onRemove(tag)}
        />
      ))}
      {isEdit && (
        <Tag
          isEdit
          key={"editor-tag"}
          className={classes["editor-tag"]}
          tag={editContent}
          isDarkMode={isDarkMode}
          onKeyDown={onKeyDown}
        />
      )}
    </div>
  );
}

export default Tags;
