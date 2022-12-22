import React from "react";

//Image
import quoteImage from "../../assets/img/Einstein-quote.png";

//CSS
import classes from "./Quote.module.css";

function Quote() {
  return (
    <div className={classes["quote-container"]}>
      <img
        src={quoteImage}
        alt="great man quote"
        className={classes["title-img"]}
      />
      <h1>
        If you can't explain it simply, you don't understand it well enough.{" "}
        <br />
        <br />
        —— Albert Einstein
      </h1>
    </div>
  );
}

export default Quote;
