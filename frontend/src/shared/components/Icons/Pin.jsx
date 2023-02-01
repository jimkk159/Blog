import React, { useEffect, useState } from "react";
import { BsFillPinAngleFill, BsFillPinFill } from "react-icons/bs";

//Custom Hook
import useHttp from "../../hooks/http-hook";

//Custom Component
import ErrorModal from "../UI/Modal/ErrorModal";

//CSS
import classes from "./Pin.module.css";

function Pin(props) {
  const { show, token, postId, isPined, isAdmin, isDarkMode } = props;
  const [isPin, setIsPin] = useState(false);

  //Custom Hook
  const { error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    setIsPin(isPined);
  }, [isPined]);

  //Pinned
  const PinedHandler = async (event) => {
    event.stopPropagation();
    console.log("Pinned!");
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/${postId}/pin?pin=1`,
        "PATCH",
        "",
        {
          Authorization: "Bearer " + token,
        }
      );
      setIsPin(true);
    } catch (err) {}
  };

  //Unpinned
  const unpinedHandler = async (event) => {
    event.stopPropagation();
    console.log("Unpinned!");
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/${postId}/pin?pin=0`,
        "PATCH",
        "",
        {
          Authorization: "Bearer " + token,
        }
      );
      setIsPin(false);
    } catch (err) {}
  };

  if (!show) return;
  if (isPin)
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
