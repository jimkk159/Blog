import React, { useRef, useState, useReducer, useEffect } from "react";

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
  children: [],
};

const topicReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        topic: action.topic,
        parent: action.parent,
        children: action.children,
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
        children: [...action.children],
      };
    case "RESET_PARENT":
      return {
        ...state,
        parent: "",
        children: [],
      };
    case "REMOVE_CHILD":
      const newChilds = state.children.filter(
        (child) => child !== action.child
      );
      return {
        ...state,
        children: newChilds,
      };
    case "RESET":
      return initialState;
    default:
      throw new Error();
  }
};

function PostTopic({ topic, topics, isDarkMode, onChange, onTag, onRemove }) {
  const topicArray = topics ? topics.map((topic) => topic.topic) : [];
  const searchRef = useRef(null);
  const [isInit, setIsInit] = useState(true);
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
      const [topic] = topics.filter((topic) => {
        return topic?.topic.toLowerCase() === event.target.value.toLowerCase();
      });
      if (
        topic &&
        topicState?.topic === "" &&
        topic?.topic.toLowerCase() === "Root".toLowerCase()
      )
        return;

      if (topic && topicState.topic === "") {
        //Setting Existed Topic
        onChange({
          ...topicState,
          topic: topic?.topic,
          parent: topic?.parent,
          children: topic?.children,
        });
        onTag(topic?.topic);
        return dispatch({
          type: "SET",
          topic: topic?.topic,
          parent: topic?.parent,
          children: topic?.children,
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
      if (topic && topicState.parent === "") {
        //Setting Parent and its children
        onChange({
          ...topicState,
          parent: topic?.topic,
          children: [...topic?.children],
        });
        return dispatch({
          type: "PARENT",
          parent: topic?.topic,
          children: [...topic?.children],
        });
      }
    }
  };

  //Topic tag click
  const topicHandler = (choice) => {
    const [topic] = topics.filter(
      (topic) => topic?.topic.toLowerCase() === choice.toLowerCase()
    );

    if (!topic) return;
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
        topic: topic?.topic,
        parent: topic?.parent,
        children: topic?.children,
      });
      onTag(topic?.topic);
      return dispatch({
        type: "SET",
        topic: topic?.topic,
        parent: topic?.parent,
        children: topic?.children,
      });
    }
    //Setting Parent
    if (topicState.parent === "") {
      onChange({
        ...topicState,
        parent: topic?.topic,
        children: [...topic?.children],
      });
      return dispatch({
        type: "PARENT",
        parent: topic?.topic,
        children: [...topic?.children],
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
    if (topicArray.includes(topicState.topic)) {
      onChange(initialState);
      return dispatch({
        type: "RESET",
      });
    }

    //Reset Parent
    const [topic] = topics.filter(
      (topic) => topic?.topic.toLowerCase() === parent.toLowerCase()
    );
    if (!topic) return;
    onChange({ ...topicState, parent: "", children: [] });
    dispatch({
      type: "RESET_PARENT",
    });
  };

  //Set Child
  const setChildHandler = (child) => {
    if (topicArray.includes(topicState.topic)) {
      onChange(initialState);
      return dispatch({
        type: "RESET",
      });
    }
    const [topic] = topics.filter(
      (topic) => topic?.topic.toLowerCase() === child.toLowerCase()
    );
    if (!topic) return;

    //Remove child from existed children
    const newChildren = topicState.children.filter((item) => item !== child);
    onChange({
      ...topicState,
      children: newChildren,
    });
    dispatch({
      type: "REMOVE_CHILD",
      child,
    });
  };

  useEffect(() => {
    if (isInit && topic) {
      dispatch({
        type: "SET",
        topic: topic?.topic,
        parent: topic?.parent,
        children: topic?.children,
      });
      setIsInit(false);
    }
  }, [isInit, topic]);

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
            description={"What is your post topic?"}
            showTag={topicState.topic}
            tags={topicState.topic}
            isDarkMode={isDarkMode}
            onTag={() => {
              resetTopicHandler();
              onRemove(topicState.topic);
            }}
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
            key={"children"}
            description={"What is the child of this topic?"}
            tags={topicState.children}
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
