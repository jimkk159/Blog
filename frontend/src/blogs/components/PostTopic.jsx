import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//Redux Slice
import { postActions } from "../../store/post-slice";

//Custom Component
import GuideOpen from "./BlogGuide/GuideOpen";
import Tag from "../../shared/components/UI/Tag";
import Card from "../../shared/components/UI/Card";
import PostTopicQuestion from "./PostTopicQuestion";

//CSS
import classes from "./PostTopic.module.css";

function PostTopic({ topics, isDarkMode, onTag, onRemove }) {
  const topicArray = topics ? topics.map((topic) => topic.topic) : [];
  const searchRef = useRef(null);
  const [searchItem, setSearchItem] = useState("");

  //Redux
  const { topic, parent, children } = useSelector((state) => state.post);
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();

  //Input Search
  const searchChangeHandler = (event) => {
    setSearchItem(event.target.value);
  };

  //Input EnterKey
  const searchKeyDownHandler = (event) => {
    if (event.key === "Enter") {
      setSearchItem("");
      const [findingTopic] = topics.filter((topic) => {
        return topic?.topic.toLowerCase() === event.target.value.toLowerCase();
      });
      if (findingTopic?.topic?.toLowerCase() === "root") return;
      if (findingTopic && !topic) {
        //Setting Existed Topic
        onTag(findingTopic?.topic);
        return dispatch(
          postActions.setTopic({
            topic: findingTopic?.topic,
            parent: findingTopic?.parent,
            children: findingTopic?.children,
          })
        );
      }
      if (!topic) {
        //Setting Topic
        return dispatch(
          postActions.setTopic({
            topic: event.target.value,
          })
        );
      }
      if (findingTopic && !parent) {
        //Setting Parent and its children
        return dispatch(
          postActions.setTopic({
            parent: findingTopic?.topic,
            children: [...findingTopic?.children],
          })
        );
      }
    }
  };

  //Topic tag click
  const topicHandler = (choice) => {
    const [findingTopic] = topics.filter(
      (topic) => topic?.topic.toLowerCase() === choice.toLowerCase()
    );

    if (!findingTopic) return;
    if (!topic && choice.toLowerCase() === "root") return;
    //Setting Existed Topic
    if (!topic) {
      setSearchItem("");
      onTag(findingTopic?.topic);
      return dispatch(
        postActions.setTopic({
          topic: findingTopic?.topic,
          parent: findingTopic?.parent,
          children: findingTopic?.children,
        })
      );
    }
    //Setting Parent
    if (!parent) {
      return dispatch(
        postActions.setTopic({
          parent: findingTopic?.topic,
          children: [...findingTopic?.children],
        })
      );
    }
  };

  //Reset Topic
  const resetTopicHandler = () => {
    return dispatch(postActions.resetTopic());
  };

  //Set Parent
  const setParentHandler = (parent) => {
    if (topicArray.includes(topic))
      return dispatch(postActions.resetTopic());

    //Reset Parent
    const [findingTopic] = topics.filter(
      (topic) => topic?.topic.toLowerCase() === parent.toLowerCase()
    );
    if (!findingTopic) return;
    dispatch(postActions.reseRelation());
  };

  //Set Child
  const setChildHandler = (child) => {
    if (topicArray.includes(topic))
      return dispatch(postActions.resetTopic());

    const [findingTopic] = topics.filter(
      (topic) => topic?.topic.toLowerCase() === child.toLowerCase()
    );
    if (!findingTopic) return;

    //Remove child from existed children
    const newChildren = children.filter((item) => item !== child);
    dispatch(
      postActions.setTopic({
        children: newChildren,
      })
    );
  };

  return (
    <Card className={`${classes["container"]}`} isDarkMode={isDarkMode}>
      <h1 className={`${classes["title"]}`}>{language.topic}</h1>
      <input
        ref={searchRef}
        type="text"
        value={searchItem}
        className={`${classes["topic-input"]} ${
          isDarkMode ? classes["input-dark"] : classes["input-light"]
        }`}
        placeholder={"Search..."}
        onChange={searchChangeHandler}
        onKeyDown={(event) => searchKeyDownHandler(event)}
      />
      <hr className={`${classes["topic-hr"]}`} />
      <div
        className={`${classes["topic-container"]} ${
          isDarkMode ? classes["topics-dark"] : classes["topics-light"]
        }`}
      >
        <div className={classes["topic-tags"]}>
          {topicArray.map((topicTag, index) => {
            const topicToLower = topicTag?.toLowerCase();
            if (
              topicToLower.includes(searchItem?.toLowerCase()) &&
              topicToLower !== "root"
            )
              return (
                <Tag
                  key={index}
                  className={classes["tag"]}
                  tag={topicTag}
                  isEdit
                  isDarkMode={isDarkMode}
                  onClick={() => topicHandler(topicTag)}
                />
              );
            else return null;
          })}
        </div>
        <div className={classes["topic-description"]}>
          <PostTopicQuestion
            key={"topic"}
            description={language.topicQ1}
            showTag={topic}
            tags={topic}
            isDarkMode={isDarkMode}
            onTag={() => {
              resetTopicHandler();
              onRemove(topic);
            }}
          />
          <PostTopicQuestion
            key={"parent"}
            description={language.topicQ2}
            showTag={parent}
            tags={parent}
            isDarkMode={isDarkMode}
            onTag={() => setParentHandler(parent)}
          />
          <PostTopicQuestion
            key={"children"}
            description={language.topicQ3}
            tags={children}
            isDarkMode={isDarkMode}
            onTag={setChildHandler}
          />
        </div>
        <GuideOpen
          className={`${classes["topic-graphic"]}`}
          topics={topics}
          isDarkMode={!isDarkMode}
          isEdit
          onEdit={topicHandler}
        />
      </div>
    </Card>
  );
}

export default PostTopic;
