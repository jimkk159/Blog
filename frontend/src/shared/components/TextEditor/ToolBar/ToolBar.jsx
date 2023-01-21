import React from "react";

//Custom Hook
import useMediaQuery from "../../../hooks/media-query-hook";

//Custom Component
import ToolBarLayout from "./ToolBarLayout/ToolBarLayout";
import ToolBarLayout768 from "./ToolBarLayout/ToolBarLayout768";
import ToolBarLayout1024 from "./ToolBarLayout/ToolBarLayout1024";

//CSS
import classes from "./ToolBar.module.css";

function ToolBar(props) {
  const { matches: matches_768 } = useMediaQuery("min", "768");
  const { matches: matches_1024 } = useMediaQuery("min", "1024");

  //Very Import to prevent the Text editor force when chooseing
  //the tool bar to keep Selection text on text editor
  const preventDefaultHandler = (event) => {
    event.preventDefault();
  };
  if (matches_1024)
    return (
      <div
        className={`${classes["container"]} ${
          props.isDarkMode
            ? classes["container-dark"]
            : classes["container-light"]
        } `}
        onMouseDown={preventDefaultHandler}
      >
        <ToolBarLayout1024 {...props} />
      </div>
    );

  if (matches_768)
    return (
      <div
        className={`${classes["container"]} ${
          props.isDarkMode
            ? classes["container-dark"]
            : classes["container-light"]
        } `}
        onMouseDown={preventDefaultHandler}
      >
        <ToolBarLayout768 {...props} />
      </div>
    );

  return (
    <div
      className={`${classes["container"]} ${
        props.isDarkMode
          ? classes["container-dark"]
          : classes["container-light"]
      } `}
      onMouseDown={preventDefaultHandler}
    >
      <ToolBarLayout {...props} />
    </div>
  );
}

export default ToolBar;
//reference 4:https://www.youtube.com/watch?v=PuzqX5dxxKs
//reference 5:https://stackoverflow.com/questions/57213374/reactjs-and-draftjs-how-to-change-font-size-on-the-fly
