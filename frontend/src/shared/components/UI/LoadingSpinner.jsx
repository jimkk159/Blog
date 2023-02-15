import React from "react";

//Image
import dogChaseCatImage from "../../../assets/img/loading/dog_chase_cat.gif";
import catSleepingImage from "../../../assets/img/loading/cat-sleeping.gif";
import catSwagImage from "../../../assets/img/loading/cat-swag-tail.gif";
import guraChristmasImage from "../../../assets/img/loading/gura-christmas.gif";
import guraSpinImage from "../../../assets/img/loading/gura-gura-spin.gif";
import bocchiImage from "../../../assets/img/loading/Bocchi-Rock.gif";

//CSS
import classes from "./LoadingSpinner.module.css";
const Images = [
  dogChaseCatImage,
  bocchiImage,
  guraSpinImage,
  guraChristmasImage,
  catSwagImage,
  catSleepingImage,
];

function LoadingSpinner(props) {
  const randomNum = Math.floor(7 * Math.random());

  //Loading Content
  let loadingContent;
  if (randomNum === Images.length) {
    loadingContent = (
      <div
        className={`${classes["rotating-ring"]} ${
          props.isDarkMode ? classes.dark : classes.light
        }`}
      />
    );
  } else if (randomNum === 2 || randomNum === 3) {
    loadingContent = (
      <img
        className={classes["small-img"]}
        src={Images[randomNum]}
        alt="loading animate"
      />
    );
  } else {
    loadingContent = (
      <img
        className={classes.img}
        src={Images[randomNum]}
        alt="loading animate"
      />
    );
  }

  return (
    <div
      className={`center ${props.className} ${
        props.asOverlay && classes.overlay
      }`}
    >
      {loadingContent}
    </div>
  );
}

export default LoadingSpinner;