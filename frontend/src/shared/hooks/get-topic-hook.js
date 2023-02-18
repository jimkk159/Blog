import { useCallback } from "react";
import { useDispatch } from "react-redux";

//Redux Slice
import { topicActions } from "../../store/topic-slice";

//Custom Hook
import useHttp from "./http-hook";

const useTopic = () => {
  //Redux
  const dispatch = useDispatch();

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //GET Topics
  const fetchTopics = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/topics"
      );
      const topics = responseData.map((item) => ({
        ...item,
        parent: "",
        children: [],
      }));

      //Setting parent and children
      for (let i = 0; i < topics.length; i++) {
        for (let j = 0; j < topics.length; j++) {
          if (i === j) continue;
          if (topics[i].parent_id === topics[j].id) {
            topics[i].parent = topics[j].topic;
            topics[j].children.push(topics[i].topic);
          }
        }
      }
      dispatch(topicActions.setTopics({ topics }));
      return topics;
    } catch (err) {}
  }, [dispatch, sendRequest]);

  return { fetchTopics, isLoading, error, clearError };
};

export default useTopic;
