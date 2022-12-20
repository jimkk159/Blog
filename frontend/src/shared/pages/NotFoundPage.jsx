import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

//Image
import animateImage from "../../assets/img/Shock-Bocchi.gif";

//Custom Context
import { ThemeContext } from "../context/theme-context";

//Custom Component
import Card from "../components/UI/Card";
import Button from "../components/Form/Button";

//CSS
import classes from "../pages/NotFoundPage.module.css";

function NotFoundPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const retrunHandler = () => {
    navigate("/");
  };
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
            <div>
              <div className={classes["error-content"]}>
                <div className={classes["error-textarea"]}>
                  <h1 className={classes["not-found"]}>
                    404 <span className={classes["suffix"]}>not found...</span>
                  </h1>
                  <h2 className={classes["description"]}>
                    This page does not exist...{" "}
                  </h2>
                  <p className={classes["cry-face"]}>;^;</p>
                </div>
                <div className={classes["image-container"]}>
                  <img
                    src={animateImage}
                    alt={"shock-girl"}
                    className={classes["animate-img"]}
                  />
                </div>
              </div>
              <Button
                className={classes["return-button"]}
                content="Return"
                isDarkMode={isDarkMode}
                onClick={retrunHandler}
              />
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}

export default NotFoundPage;
//reference:https://www.youtube.com/watch?v=vOSpZwftRhg
