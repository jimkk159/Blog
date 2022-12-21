import React from "react";

//Image
import catBongo from "../../../assets/img/loading/cat-bongo.gif";
import catSleepingImage from "../../../assets/img/loading/cat-sleeping.gif";
import catSwagImage from "../../../assets/img/loading/cat-swag-tail.gif";
import guraChristmasImage from "../../../assets/img/loading/gura-christmas.gif";
import guraSpinImage from "../../../assets/img/loading/gura-gura-spin.gif";
import bocchiImage from "../../../assets/img/loading/Bocchi-Rock.gif";
import rabbitImage from "../../../assets/img/loading/野うさぎ同盟.gif";

//CSS
import classes from "./LoadingSpinner.module.css";
const Images = [
  bocchiImage,
  guraSpinImage,
  guraChristmasImage,
  catBongo,
  catSwagImage,
  catSleepingImage,
  rabbitImage
];

function LoadingSpinner(props) {
  const randomNum = Math.floor(8 * Math.random());

  //Loading Content
  let loadingContent;
  if (randomNum === 7) {
    loadingContent = (
      <div
        className={`${classes["rotating-ring"]} ${
          props.isDarkMode ? classes.dark : classes.light
        }`}
      />
    );
  } else if (randomNum === 2 || randomNum === 3){
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
      className={`${props.className} ${props.asOverlay && classes.overlay} `}
    >
      {loadingContent}
    </div>
  );
}

export default LoadingSpinner;
