import React, { useEffect, useState } from "react";

//Icon
import { AiOutlineTag } from "react-icons/ai";

//Custom Component
import Tag from "./Tag";

//CSS
import classes from "./Tags.module.css";

function Tags({ content, isEdit, isDarkMode, onKeyDown, onRemove }) {
  const [editTag, setEditTag] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {

    if (isEdit && content?.length > 0) {
      setEditTag(content[content.length - 1]);
      setTags(content.slice(0, -1));
    } else {
      setEditTag(null);
      setTags(content);
    }
  }, [content, isEdit]);

  return (
    <div className={classes["detail-bottom"]}>
      <AiOutlineTag className={classes["icon"]} />
      {tags?.map((tag, index) => (
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
          tag={editTag}
          isDarkMode={isDarkMode}
          onKeyDown={onKeyDown}
        />
      )}
    </div>
  );
}

export default Tags;
