import React from "react";
import { useSelector } from "react-redux";

//CSS
import classes from "./Footer.module.css";

function Footer(props) {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <footer>
      <div
        className={`${classes["foot-container"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
      >
        <p>Copyright &copy; Jim's Blog 2022</p>
      </div>
    </footer>
  );
}

export default Footer;
