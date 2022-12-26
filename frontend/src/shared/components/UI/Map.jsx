import React, { useState } from "react";

//Icon
import mapImage from "../../../assets/img/Map.png";

//Custom Hook
import useMediaQuery from "../../hooks/media-query-hook";

//Custom Comonent
import Card from "./Card";

//CSS
import classes from "./Map.module.css";

function Map(props) {
  const [isOpen, setIsOpen] = useState(false);

  //Custom Hook
  const { matches: matches_768 } = useMediaQuery("min", "768");
  const { matches: matches_1024 } = useMediaQuery("min", "1024");

  const openHandler = () => {
    setIsOpen(true);
  };

  return (
    !isOpen && (
      <Card
        className={`${classes["map-container"]} ${
          matches_1024 ? classes["map-1024"] : matches_768 && classes["map-768"]
        }`}
      >
        <img src={mapImage} alt={"map"} onClick={openHandler}/>
      </Card>
    )
  );
}

export default Map;
