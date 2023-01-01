import React from "react";
import { useSelector } from "react-redux";
import { useRouteError } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

//Image
import cubesImage from "../../assets/img/cubes.png";
import animateImage from "../../assets/img/Sad-Bocchi.gif";

//Custom Component
import Card from "../components/UI/Card";
import Footer from "../components/Footer/Footer";

//CSS
import classes from "../pages/ErrorPage.module.css";

function ErrorPage() {
  const isDarkMode = useSelector((state) => state.theme.value);

  const error = useRouteError();
  console.log(error);
  return (
    <div
      className={`${classes["error-layout"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
      style={{ backgroundImage: `url(${cubesImage})` }}
    >
      <Navigation />
      <main className="error">
        <Card className="page" isDarkMode={isDarkMode}>
          <div className={`${classes["error-page"]} `}>
            <div className={classes["error-content"]}>
              <div className={classes["error-textarea"]}>
                <h1 className={classes["oops"]}>Oops!</h1>
                <h2 className={classes["suffix"]}>An error occurred...</h2>
                <p className={classes["message"]}>{error.message}</p>
              </div>
              <div className={`${classes["image-container"]}`}>
                <img
                  src={animateImage}
                  alt="sad-girl"
                  className={`${classes["animate-img"]} ${
                    isDarkMode ? null : classes["img-dark"]
                  }`}
                />
              </div>
            </div>
          </div>
        </Card>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default ErrorPage;
