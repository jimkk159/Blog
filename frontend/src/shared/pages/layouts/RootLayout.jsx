import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

//Image
import cubesImage from "../../../assets/img/cubes.png";

//Custom Component
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";

//CSS
import classes from "./RootLayout.module.css";

function RootLayout() {
  const isDarkMode = useSelector((state) => state.theme.value);

  return (
    <>
      <div
        className={`${classes["root-layout"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
        style={{ backgroundImage: `url(${cubesImage})` }}
      >
        <Navigation />
        <main>
          <Outlet />
        </main>
        <Footer isDarkMode={isDarkMode} />
      </div>
    </>
  );
}

export default RootLayout;
