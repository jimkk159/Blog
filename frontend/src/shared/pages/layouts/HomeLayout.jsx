import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

//Image
import cubesImage from "../../../assets/img/cubes.png";

//Custom Component
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";

//CSS
import classes from "./HomeLayout.module.css";

function HomeLayout() {
  const isDarkMode = useSelector((state) => state.theme.value);

  return (
    <>
      <div
        className={`${classes["home-layout"]} ${
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

export default HomeLayout;
