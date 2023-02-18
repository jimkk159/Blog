import React from "react";

//Custom Comonent
import GuideOpen from "./GuideOpen";
import GuideClose from "./GuideClose";
import ScrollOpenClose from "../../../shared/components/UI/ScrollOpenClose";

//CSS
import classes from "./Guide.module.css";

function Guide({ isDarkMode, topics }) {
  const openItem = (
    <GuideOpen isDarkMode={isDarkMode} topics={topics} isHome isCancel />
  );

  const closeItem = <GuideClose  />;

  return (
    <ScrollOpenClose
      className={classes["position"]}
      openItem={openItem}
      closeItem={closeItem}
    />
  );
}

export default Guide;
