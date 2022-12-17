import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

//Image
import cubesImage from "../../../img/cubes.png";

//Custom Context
import { ThemeContext } from "../../context/theme-context.js";

//Custom Component
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";

//CSS
import classes from "./RootLayout.module.css";

function RootLayout() {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`${classes["root"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
      style={{ backgroundImage: `url(${cubesImage})` }}
    >
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
