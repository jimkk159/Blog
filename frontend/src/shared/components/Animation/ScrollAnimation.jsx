import React, { useEffect, useState } from "react";

//Custom Hook
import useScroll from "../../hooks/scorll-hook";

//CSS
import classes from "./ScrollAnimation.module.css";

function ScrollAnimation(props) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const fixTop = props.top
    ? currentPosition +
      Math.floor(window.innerHeight / (100 / +props.top.replace("%", "")))
    : currentPosition + Math.floor(window.innerHeight / 4);
  const allowOffset = props.allowOffset ? props.allowOffset : 120;

  //Custom Hook
  const { scrollPosition } = useScroll();
  //Monitor when Scroll
  useEffect(() => {
    if (Math.abs(scrollPosition - currentPosition) > allowOffset) {
      setCurrentPosition(scrollPosition);
    }
  }, [currentPosition, scrollPosition, allowOffset]);

  return (
    <div
      className={`${classes["container"]} ${props.className}`}
      style={{
        top: fixTop,
      }}
    >
      {props.children}
    </div>
  );
}

export default ScrollAnimation;
