import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//Redux Slice
import { toolbarActions } from "../../../store/toolbar-slice";

//Image
import cubesImage from "../../../assets/img/cubes.png";

//Custom Component
import Footer from "../../../shared/components/Footer/Footer";
import Navigation from "../../../shared/components/Navigation/Navigation";

//CSS
import classes from "./PostLayout.module.css";

function PostLayout() {
  const [isEdit, setIsEdit] = useState(false);

  //Redux
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.value);

  //React Router
  const location = useLocation();
  const initIsEdit = location?.state?.isEdit ? location.state.isEdit : false;
  
  //Todo use forselection
  const mouseDownHandler = () => {
    dispatch(toolbarActions.closeAll());
  };

  useEffect(() => {
    setIsEdit(initIsEdit);
  }, [initIsEdit]);

  return (
    <div
      className={`${classes["blog-layout"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
      style={{ backgroundImage: `url(${cubesImage})` }}
      onMouseDown={isEdit ? mouseDownHandler : null}
    >
      <Navigation />
      <main>
        <Outlet
          context={{
            edit: [isEdit, setIsEdit],
          }}
        />
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default PostLayout;
