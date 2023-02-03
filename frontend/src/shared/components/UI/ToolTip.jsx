import React from "react";
import { CSSTransition } from "react-transition-group";

//CSS
import classes from "./ToolTip.module.css";

function ToolTip({ className, show, isAnimate, children }) {
  if (isAnimate)
    return (
      <CSSTransition
        in={show}
        timeout={{ enter: 500, exit: 500 }}
        className={`${className} ${classes["tooltip-container"]}`}
        classNames={{
          enter: classes["tooltip-enter"],
          enterActive: classes["tooltip-enter-active"],
          enterDone: classes["tooltip-enter-done"],
          exit: classes["tooltip-exit"],
          exitActive: classes["tooltip-exit-active"],
          exitDone: classes["tooltip-exit-done"],
        }}
        onMouseDown={(event) => event.stopPropagation()}
        mountOnEnter
        unmountOnExit
      >
        {children}
      </CSSTransition>
    );
  return (
    <div
      className={`${className} ${classes["tooltip-container"]}`}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
}

export default ToolTip;
