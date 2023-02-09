import React from "react";

//Custom Component
import Toggle from "./Toggle";

//CSS
// import classes from "./Laguage.module.css";

function Languae({ className, show, onToggle, isDarkMode, children }) {
  return (
    <div className={className}>
      <Toggle show={show} onToggle={onToggle} isDarkMode={isDarkMode}>
        {children}
      </Toggle>
    </div>
  );
}

export default Languae;
