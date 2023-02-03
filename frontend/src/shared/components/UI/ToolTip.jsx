import React from "react";

//CSS
import classes from "./ToolTip.module.css";

function ToolTip({ className, show, children }) {
  if (!show) return;
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
