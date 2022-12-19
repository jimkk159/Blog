import React, { useContext } from "react";
import { useRouteError } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

//Image
import robotImage from "../../assets/img/wall-e.png";

//Custom Context
import { ThemeContext } from "../context/theme-context";

//Custom Component
import Card from "../components/UI/Card";

//CSS
import classes from "../pages/ErrorPage.module.css";

function ErrorPage() {
  const { isDarkMode } = useContext(ThemeContext);

  const error = useRouteError();
  return (
    <>
      <Navigation />
      <main className="error">
        <Card className="page" isDarkMode={isDarkMode}>
          <div
            className={`${classes["error-page"]} ${
              isDarkMode ? classes.dark : classes.light
            }`}
          >
            <div className={classes["error-content"]}>
              <div className={classes["error-textarea"]}>
                <h1 className={classes["oops"]}>Oops!</h1>
                <h2 className={classes["suffix"]}>An error occurred...</h2>
                <p className={classes["message"]}>{error.message}</p>
              </div>
              <div className={classes["image-container"]}>
                <img
                  src={robotImage}
                  alt="robot"
                  className={classes["robot-img"]}
                />
              </div>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}

export default ErrorPage;
