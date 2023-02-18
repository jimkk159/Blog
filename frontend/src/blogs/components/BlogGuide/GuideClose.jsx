import React from "react";

//Icon
import mapImage from "../../../assets/img/Map.png";

//Custom Hook
import useMediaQuery from "../../../shared/hooks/media-query-hook";

//Custom Comonent
import Card from "../../../shared/components/UI/Card";

//CSS
import classes from "./GuideClose.module.css";

function GuideClose({ onOpen }) {
  //Custom Hook
  const { matches: matches_768 } = useMediaQuery("min", "768");
  const { matches: matches_1024 } = useMediaQuery("min", "1024");

  return (
    <Card
      className={`${classes["map-container"]} ${classes["transparent"]} ${
        matches_1024 ? classes["map-1024"] : matches_768 && classes["map-768"]
      }`}
      onClick={onOpen}
    >
      <img src={mapImage} alt={"map"} />
    </Card>
  );
}

export default GuideClose;
