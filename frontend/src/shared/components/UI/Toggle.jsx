import React from "react";
import { CSSTransition } from "react-transition-group";

//CSS
import classes from "./Toggle.module.css";

function Toggle({
  className,
  type,
  show,
  toggleTime,
  isToggle,
  isDarkMode,
  onToggle,
  children,
}) {
  const setToggleTime = toggleTime ? toggleTime : 400;

  //Type
  let area_class;
  let slider_class;
  if (type && type === "round") {
    if (show) {
      area_class = `${classes["area"]} ${classes["area-light-en"]} ${classes["area-round"]}`;
    } else {
      area_class = `${classes["area"]} ${classes["area-light-ch"]} ${classes["area-round"]}`;
    }

    slider_class = `${classes["slider"]} ${classes["slider-round"]}`;
  } else {
    if (show) {
      area_class = `${classes["area"]} ${classes["area-light-en"]}`;
    } else {
      area_class = `${classes["area"]} ${classes["area-light-ch"]}`;
    }
    slider_class = `${classes["slider"]}`;
  }

  return (
    <label className={`${classes["switch"]} ${className}`}>
      <input type="checkbox" defaultChecked={isToggle} onClick={onToggle} />
      <CSSTransition
        in={show}
        timeout={setToggleTime}
        classNames={{
          enter: classes["area-enter"],
          enterActive: classes["area-enter-active"],
          enterDone: classes["area-enter-done"],
          exit: classes["area-exit"],
          exitActive: classes["area-exit-active"],
          exitDone: classes["area-exit-done"],
        }}
      >
        <span
          className={`${area_class} ${
            isDarkMode ? classes["area-dark"] : classes["area-light"]
          }`}
        >
          {children}
        </span>
      </CSSTransition>
      <CSSTransition
        key={"test"}
        in={show}
        timeout={setToggleTime}
        classNames={{
          enter: classes["slider-enter"],
          enterActive: classes["slider-enter-active"],
          enterDone: classes["slider-enter-done"],
          exit: classes["slider-exit"],
          exitActive: classes["slider-exit-active"],
          exitDone: classes["slider-exit-done"],
        }}
      >
        <span className={slider_class}></span>
      </CSSTransition>
    </label>
  );
}

export default Toggle;

//reference:https://stackoverflow.com/questions/28269669/css-pseudo-elements-in-react
