import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

//Image
import animateImage from "../../assets/img/Shock-Bocchi.gif";

//Custom Component
import Card from "../components/UI/Card";

//CSS
import classes from "../pages/NotFoundPage.module.css";

function NotFoundPage() {
  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  return (
    <>
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
                  <div className={`${classes["return-container"]}`}>
                    <p className={classes["return-arrow"]}>{`<<`}&nbsp;</p>
                    <Link className={classes["return-link"]} to="/">
                      {"Return"}
                    </Link>
                  </div>
                </div>
                <div className={classes["image-container"]}>
                  <img
                    src={animateImage}
                    alt={"shock-girl"}
                    className={classes["animate-img"]}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}

export default NotFoundPage;
//reference:https://www.youtube.com/watch?v=vOSpZwftRhg
