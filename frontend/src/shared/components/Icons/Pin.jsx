import React from "react";
import { BsFillPinAngleFill, BsFillPinFill } from "react-icons/bs";

//Custom Hook
import useHttp from "../../hooks/http-hook";

//Custom Component
import ErrorModal from "../UI/Modal/ErrorModal";

//CSS
import classes from "./Pin.module.css";

function Pin(props) {
  const { show, token, postId, isPined, isAdmin, isDarkMode, onPin } = props;

  //Custom Hook
  const { error, sendRequest, clearError } = useHttp();

  const pinPostHandler = (posts, pid, pin) => {
    const pinnedPosts = posts.map((post) => {
      if (post?.id === pid) return { ...post, pin };
      else return post;
    });
    const pined = pinnedPosts.filter((post) => !!post?.pin);
    const unpined = pinnedPosts.filter((post) => !post?.pin);
    return [...pined, ...unpined];
  };

  //Pinned
  const PinedHandler = async (event) => {
    event.stopPropagation();
    console.log("Pinned!");
    if (!token || !isAdmin) return;
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/pin/${postId}?pin=1`,
        "PATCH",
        "",
        {
          Authorization: "Bearer " + token,
        }
      );
      if (onPin) {
        onPin((prev) => pinPostHandler(prev, postId, 1));
      }
    } catch (err) {}
  };

  //Unpinned
  const unpinedHandler = async (event) => {
    event.stopPropagation();
    console.log("Unpinned!");
    if (!token || !isAdmin) return;
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/pin/${postId}?pin=0`,
        "PATCH",
        "",
        {
          Authorization: "Bearer " + token,
        }
      );
      if (onPin) {
        onPin((prev) => pinPostHandler(prev, postId, 0));
      }
    } catch (err) {}
  };

  if (!show) return;
  if (isPined)
    return (
      <>
        <ErrorModal error={error} onClear={clearError} />
        <BsFillPinFill
          className={`${isAdmin && classes["pin"]} ${
            !isDarkMode && classes["light-pin"]
          } ${props.className}`}
          onClick={unpinedHandler}
        />
      </>
    );
  if (isAdmin)
    return (
      <>
        <ErrorModal error={error} onClear={clearError} />
        <BsFillPinAngleFill
          className={`${isAdmin && classes["pin"]} ${
            !isDarkMode && classes["light-pin"]
          } ${props.className}`}
          onClick={PinedHandler}
        />
      </>
    );
  return;
}

export default Pin;
