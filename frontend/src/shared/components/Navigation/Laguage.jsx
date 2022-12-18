import React from "react";

//Custom Component
import Toggle from "../UI/Toggle";

//CSS
// import classes from "./Laguage.module.css";

function Languae(props) {
  return (
    <div className={props.className}>
      <Toggle
        show={props.show}
        onToggle={props.onToggle}
        isDarkMode={props.isDarkMode}
      >
        {props.children}
      </Toggle>
    </div>
  );
}

export default Languae;
