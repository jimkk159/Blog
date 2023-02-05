import React, { useRef, useState, useReducer } from "react";

//Custom Component
import GuideOpen from "./BlogGuide/GuideOpen";
import Tag from "../../shared/components/UI/Tag";
import Card from "../../shared/components/UI/Card";
import PostTopicQuestion from "./PostTopicQuestion";

//CSS
import classes from "./PostTopic.module.css";

const initialState = {
  topic: "",
  parent: "",
  childs: [],
};

const topicReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        topic: action.topic,
        parent: action.parent,
        childs: action.childs,
      };
    case "TOPIC":
      return {
        ...state,
        topic: action.topic,
      };
    case "PARENT":
      return {
        ...state,
        parent: action.parent,
        childs: [...action.childs],
      };
    case "RESET_PARENT":
      return {
        ...state,
        parent: "",
        childs: [],
      };
    case "REMOVE_CHILD":
      const newChilds = state.childs.filter((child) => child !== action.child);
      return {
        ...state,
        childs: newChilds,
      };
    case "RESET":
      return initialState;
    default:
      throw new Error();
  }
};

function PostTopic({ topics, topicsInfo, isDarkMode, onChange, onTag }) {
  const searchRef = useRef(null);
  const [searchItem, setSearchItem] = useState("");
  const [topicState, dispatch] = useReducer(topicReducer, initialState);

  //Input Search
  const searchChangeHandler = (event) => {
    setSearchItem(event.target.value);
  };

  //Input EnterKey
  const searchKeyDownHandler = (event) => {
    if (event.key === "Enter") {
      setSearchItem("");
      const topicInfo = topicsInfo.filter(
        (topicInfo) =>
          topicInfo?.topic.toLowerCase() === event.target.value.toLowerCase()
      )[0];

      if (
        topicInfo &&
        topicState?.topic === "" &&
        topicInfo?.topic.toLowerCase() === "Root".toLowerCase()
      )
        return;

      if (topicInfo && topicState.topic === "") {
        //Setting Existed Topic
        onChange({
          ...topicState,
          topic: topicInfo?.topic,
          parent: topicInfo?.parent,
          childs: topicInfo?.childs,
        });
        onTag(topicInfo?.topic);
        return dispatch({
          type: "SET",
          topic: topicInfo?.topic,
          parent: topicInfo?.parent,
          childs: topicInfo?.childs,
        });
      }

      if (topicState.topic === "") {
        //Setting Topic
        onChange({
          ...topicState,
          topic: event.target.value,
        });
        return dispatch({
          type: "TOPIC",
          topic: event.target.value,
        });
      }

      if (topicInfo && topicState.parent === "") {
        //Setting Parent and its childs
        onChange({
          ...topicState,
          parent: topicInfo?.topic,
          childs: [...topicInfo?.childs],
        });
        return dispatch({
          type: "PARENT",
          parent: topicInfo?.topic,
          childs: [...topicInfo?.childs],
        });
      }
    }
  };

  //Topic tag click
  const topicHandler = (choice) => {
    const topicInfo = topicsInfo.filter(
      (topicInfo) => topicInfo?.topic.toLowerCase() === choice.toLowerCase()
    )[0];

    if (!topicInfo) return;
    if (
      topicState.topic === "" &&
      choice.toLowerCase() === "Root".toLowerCase()
    )
      return;
    //Setting Existed Topic
    if (topicState.topic === "") {
      setSearchItem("");
      onChange({
        ...topicState,
        topic: topicInfo?.topic,
        parent: topicInfo?.parent,
        childs: topicInfo?.childs,
      });
      onTag(topicInfo?.topic);
      return dispatch({
        type: "SET",
        topic: topicInfo?.topic,
        parent: topicInfo?.parent,
        childs: topicInfo?.childs,
      });
    }
    //Setting Parent
    if (topicState.parent === "") {
      onChange({
        ...topicState,
        parent: topicInfo?.topic,
        childs: [...topicInfo?.childs],
      });
      return dispatch({
        type: "PARENT",
        parent: topicInfo?.topic,
        childs: [...topicInfo?.childs],
      });
    }
  };

  //Reset Topic
  const resetTopicHandler = () => {
    onChange(initialState);
    return dispatch({
      type: "RESET",
    });
  };

  //Set Parent
  const setParentHandler = (parent) => {
    if (topics.includes(topicState.topic)) {
      onChange(initialState);
      return dispatch({
        type: "RESET",
      });
    }

    //Reset Parent
    const topicInfo = topicsInfo.filter(
      (topicInfo) => topicInfo?.topic.toLowerCase() === parent.toLowerCase()
    )[0];
    if (!topicInfo) return;
    onChange({ ...topicState, parent: "", childs: [] });
    dispatch({
      type: "RESET_PARENT",
    });
  };

  //Set Child
  const setChildHandler = (child) => {
    if (topics.includes(topicState.topic)) {
      onChange(initialState);
      return dispatch({
        type: "RESET",
      });
    }
    const topicInfo = topicsInfo.filter(
      (topicInfo) => topicInfo?.topic.toLowerCase() === child.toLowerCase()
    )[0];
    if (!topicInfo) return;

    //Remove child from existed childs
    const newChilds = topicState.childs.filter((item) => item !== child);
    onChange({
      ...topicState,
      childs: newChilds,
    });
    dispatch({
      type: "REMOVE_CHILD",
      child,
    });
  };

  return (
    <Card className={`${classes["container"]}`} isDarkMode={isDarkMode}>
      <h1 className={`${classes["title"]}`}>Setting Your Post Topic</h1>
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
          {topics.map((topic, index) => {
            const topicToLower = topic?.toLowerCase();
            if (
              topicToLower.includes(searchItem?.toLowerCase()) &&
              topicToLower !== "root"
            )
              return (
                <Tag
                  key={index}
                  className={classes["tag"]}
                  tag={topic}
                  isEdit
                  isDarkMode={isDarkMode}
                  onClick={() => topicHandler(topic)}
                />
              );
            else return null;
          })}
        </div>
        <div className={classes["topic-description"]}>
          <PostTopicQuestion
            key={"topic"}
            description={"What is your post topic?"}
            showTag={topicState.topic}
            tags={topicState.topic}
            isDarkMode={isDarkMode}
            onTag={resetTopicHandler}
          />
          <PostTopicQuestion
            key={"parent"}
            description={"What is the parent of this topic?"}
            showTag={topicState.parent}
            tags={topicState.parent}
            isDarkMode={isDarkMode}
            onTag={() => setParentHandler(topicState.parent)}
          />
          <PostTopicQuestion
            key={"childs"}
            description={"What is the child of this topic?"}
            tags={topicState.childs}
            isDarkMode={isDarkMode}
            onTag={setChildHandler}
          />
        </div>
        <GuideOpen
          className={`${classes["topic-graphic"]}`}
          topics={topicsInfo}
          isDarkMode={!isDarkMode}
          isEdit
          onEdit={topicHandler}
        />
      </div>
    </Card>
  );
}

export default PostTopic;
