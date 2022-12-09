import React from "react";

//CSS
import classes from './Laguage.module.css';

function Languae(props) {
  return <button className={`${classes['laguage-setting']} ${props.className}`}>{props.children}</button>;
}

export default Languae;
