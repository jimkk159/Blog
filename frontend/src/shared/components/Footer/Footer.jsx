import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../../context/theme-context.js";

//CSS
import classes from "./Footer.module.css";

function Footer(props) {
  const { isDarkMode } = useContext(ThemeContext);
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
