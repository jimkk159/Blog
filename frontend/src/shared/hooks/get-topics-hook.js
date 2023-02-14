import { useState, useEffect } from "react";

//Custom Hook
import useHttp from "./http-hook";

const useTopic = () => {
  const [topics, setTopics] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //GET Topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/topics"
        );
        const rawTopics = responseData.map((item) => ({
          ...item,
          parent: "",
          children: [],
        }));

        //Setting parent and children
        for (let i = 0; i < rawTopics.length; i++) {
          for (let j = 0; j < rawTopics.length; j++) {
            if (i === j) continue;
            if (rawTopics[i].parent_id === rawTopics[j].id) {
              rawTopics[i].parent = rawTopics[j].topic;
              rawTopics[j].children.push(rawTopics[i].topic);
            }
          }
        }
        setTopics(rawTopics);
      } catch (err) {}
    };
    fetchTopics();
  }, [sendRequest]);

  return { topics, setTopics, isLoading, error, clearError };
};

export default useTopic;
