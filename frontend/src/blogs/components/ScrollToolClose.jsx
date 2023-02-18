import React from "react";
import { BsFillPencilFill } from "react-icons/bs";

//Custom Hook
import useMediaQuery from "../../shared/hooks/media-query-hook";

//Custom Comonent
import Card from "../../shared/components/UI/Card";

//CSS
import classes from "./ScrollToolClose.module.css";

function ScrollToolClose({ onOpen }) {
  //Custom Hook
  const { matches: matches_768 } = useMediaQuery("min", "768");
  const { matches: matches_1024 } = useMediaQuery("min", "1024");

  return (
    <Card
      className={`center ${classes["toolbar-container"]} ${
        classes["transparent"]
      } ${
        matches_1024
          ? classes["toolbar-1024"]
          : matches_768 && classes["toolbar-768"]
      }`}
      onClick={onOpen}
    >
      <BsFillPencilFill className={`${classes["toolbar-icon"]}`} />
    </Card>
  );
}

export default ScrollToolClose;
