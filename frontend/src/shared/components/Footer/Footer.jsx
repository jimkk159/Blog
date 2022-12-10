import React from "react";

//CSS
import classes from "./Footer.module.css";

function Footer(props) {
  return (
    <footer>
      <div className={classes["foot-container"]}>
        <p>Copyright &copy; Jim's Blog 2022</p>
      </div>
    </footer>
  );
}

export default Footer;
