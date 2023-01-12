import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//Redux Slice
import { toolbarActions } from "../../../store/toolbar-slice";

//Image
import cubesImage from "../../../assets/img/cubes.png";

//Custom Component
import Footer from "../../../shared/components/Footer/Footer";
import Navigation from "../../../shared/components/Navigation/Navigation";

//CSS
import classes from "./BlogLayout.module.css";

function BlogLayout() {
  const isDarkMode = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  return (
    <>
      <div
        className={`${classes["blog-layout"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
        style={{ backgroundImage: `url(${cubesImage})` }}
        onMouseDown={() => {
          dispatch(toolbarActions.closeAll());
        }}
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

export default BlogLayout;
