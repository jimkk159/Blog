import React from "react";

//Custom Component
import Tag from "../../shared/components/UI/Tag";

//CSS
import classes from "./PostTopicQuestion.module.css";

function PostTopicQuestion({
  description,
  showTag = true,
  tags,
  isDarkMode,
  onTag,
}) {
  if (Array.isArray(tags) )
    return (
      <div className={classes["question-container"]}>
        <p className={classes["topic-question"]}>{description}</p>
        {tags.map((tag, index) => (
          <Tag
            key={index}
            tag={tag}
            isEdit
            isDarkMode={isDarkMode}
            onClick={() => onTag(tag)}
          />
        ))}
      </div>
    );
  return (
    <div className={classes["question-container"]}>
      <p className={classes["topic-question"]}>{description}</p>
      {showTag && (
        <Tag tag={tags} isEdit isDarkMode={isDarkMode} onClick={onTag} />
      )}
    </div>
  );
}

export default PostTopicQuestion;
