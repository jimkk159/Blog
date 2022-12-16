import React from "react";
import { CSSTransition } from "react-transition-group";

//CSS
import classes from "./Toggle.module.css";

function Toggle(props) {
  const toggleTime = props.toggleTime ? props.toggleTime : 400;

  //Type
  let area_class;
  let slider_class;
  if (props.type && props.type === "round") {
    area_class = `${classes["area"]} ${classes["area-round"]}`;
    slider_class = `${classes["slider"]} ${classes["slider-round"]}`;
  } else {
    area_class = `${classes["area"]}`;
    slider_class = `${classes["slider"]}`;
  }

  return (
    <label className={`${classes["switch"]}`}>
      <input
        type="checkbox"
        defaultChecked={props.isToggle}
        onClick={props.onToggle}
      />
      <CSSTransition
        in={props.show}
        timeout={toggleTime}
        classNames={{
          enter: classes["area-enter"],
          enterActive: classes["area-enter-active"],
          enterDone: classes["area-enter-done"],
          exit: classes["area-exit"],
          exitActive: classes["area-exit-active"],
          exitDone: classes["area-exit-done"],
        }}
      >
        <span className={`${area_class} `}>{props.children}</span>
      </CSSTransition>
      <CSSTransition
        in={props.show}
        timeout={toggleTime}
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
