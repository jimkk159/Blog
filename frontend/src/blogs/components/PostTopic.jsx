import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

//Redux Slice
import { topicActions } from "../../store/topic-slice";

//Custom Component
import GuideOpen from "./BlogGuide/GuideOpen";
import Tag from "../../shared/components/UI/Tag";
import Card from "../../shared/components/UI/Card";
import PostTopicQuestion from "./PostTopicQuestion";

//CSS
import classes from "./PostTopic.module.css";

function PostTopic({ isDarkMode, onTag, onRemove }) {
  const searchRef = useRef(null);
  const [searchItem, setSearchItem] = useState("");

  //Redux
  const { topics, topic, parent, children } = useSelector((state) => state.topic);
  const topicArray = topics ? topics.map((topic) => topic.topic) : [];
  const [collapse, setCollapse] = useState(!!topic);
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();

  //React Router
  const location = useLocation();
  const initCollapse = location?.state?.collapse
    ? location.state.collapse
    : false;

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
          topicActions.setTopic({
            topic: findingTopic?.topic,
            parent: findingTopic?.parent,
            children: findingTopic?.children,
          })
        );
      }
      if (!topic) {
        //Setting Topic
        return dispatch(
          topicActions.setTopic({
            topic: event.target.value,
          })
        );
      }
      if (findingTopic && !parent) {
        //Setting Parent and its children
        return dispatch(
          topicActions.setTopic({
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
        topicActions.setTopic({
          topic: findingTopic?.topic,
          parent: findingTopic?.parent,
          children: findingTopic?.children,
        })
      );
    }
    //Setting Parent
    if (!parent) {
      return dispatch(
        topicActions.setTopic({
          parent: findingTopic?.topic,
          children: [...findingTopic?.children],
        })
      );
    }
  };

  //Reset Topic
  const resetTopicHandler = () => {
    return dispatch(topicActions.resetTopic());
  };

  //Set Parent
  const setParentHandler = (parent) => {
    if (topicArray.includes(topic)) return dispatch(topicActions.resetTopic());

    //Reset Parent
    const [findingTopic] = topics.filter(
      (topic) => topic?.topic.toLowerCase() === parent.toLowerCase()
    );
    if (!findingTopic) return;
    dispatch(topicActions.reseRelation());
  };

  //Set Child
  const setChildHandler = (child) => {
    if (topicArray.includes(topic)) return dispatch(topicActions.resetTopic());

    const [findingTopic] = topics.filter(
      (topic) => topic?.topic.toLowerCase() === child.toLowerCase()
    );
    if (!findingTopic) return;

    //Remove child from existed children
    const newChildren = children.filter((item) => item !== child);
    dispatch(
      topicActions.setTopic({
        children: newChildren,
      })
    );
  };

  useEffect(() => {
    setCollapse(initCollapse);
  }, [initCollapse]);

  return (
    <Card className={`${classes["container"]}`} isDarkMode={isDarkMode}>
      {collapse && (
        <BsChevronUp
          className={classes["collapse"]}
          onClick={() => {
            setCollapse(false);
          }}
        />
      )}
      <h1 className={`${classes["title"]}`}>{language.topic}</h1>
      {!collapse && (
        <>
          <BsChevronDown
            className={classes["collapse"]}
            onClick={() => {
              setCollapse(true);
            }}
          />
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
        </>
      )}
    </Card>
  );
}

export default PostTopic;
