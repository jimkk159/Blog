import React from "react";

//Icon
import mapImage from "../../../assets/img/Map.png";

//Custom Hook
import useMediaQuery from "../../../shared/hooks/media-query-hook";

//Custom Comonent
import Card from "../../../shared/components/UI/Card";
import ScrollAnimation from "../../../shared/components/Animation/ScrollAnimation";

//CSS
import classes from "./GuideClose.module.css";

function GuideClose({className, onClick}) {
  //Custom Hook
  const { matches: matches_768 } = useMediaQuery("min", "768");
  const { matches: matches_1024 } = useMediaQuery("min", "1024");

  return (
    <ScrollAnimation className={`${className}`}>
      <Card
        className={`${classes["map-container"]} ${classes["transparent"]} ${
          matches_1024 ? classes["map-1024"] : matches_768 && classes["map-768"]
        }`}
        onClick={onClick}
      >
        <img src={mapImage} alt={"map"} />
      </Card>
    </ScrollAnimation>
  );
}

export default GuideClose;
