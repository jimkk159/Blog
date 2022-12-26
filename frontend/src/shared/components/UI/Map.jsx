import React, { useState } from "react";

//Icon
import mapImage from "../../../assets/img/Map.png";

//Custom Hook
import useMediaQuery from "../../hooks/media-query-hook";

//Custom Comonent
import Tree from "./Tree";
import Card from "./Card";
import ScrollAnimation from "../Animation/ScrollAnimation";

//CSS
import classes from "./Map.module.css";

function Map(props) {
  const [isOpen, setIsOpen] = useState(false);

  //Custom Hook
  const { matches: matches_768 } = useMediaQuery("min", "768");
  const { matches: matches_1024 } = useMediaQuery("min", "1024");

  const openMapHandler = () => {
    setIsOpen(true);
  };
  const closeMapHandler = () => {
    console.log(isOpen);
    setIsOpen(false);
  };

  if (!isOpen)
    return (
      <ScrollAnimation className={classes["position"]}>
        <Card
          className={`${classes["map-container"]} ${classes["transparent"]} ${
            matches_1024
              ? classes["map-1024"]
              : matches_768 && classes["map-768"]
          }`}
          onClick={openMapHandler}
        >
          <img src={mapImage} alt={"map"} />
        </Card>
      </ScrollAnimation>
    );

  return (
    <ScrollAnimation className={classes["position"]} top="20%">
      <Card
        className={`${classes["map-container"]} ${classes["show-container"]}`}
        isDarkMode={props.isDarkMode}
        onClick={closeMapHandler}
      >
        <Tree />
      </Card>
    </ScrollAnimation>
  );
}

export default Map;
