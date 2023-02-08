import React, { useState } from "react";

//Custom Comonent
import GuideOpen from "./GuideOpen";
import GuideClose from "./GuideClose";

//CSS
import classes from "./Guide.module.css";

function Guide({isDarkMode, topics}) {
  const [isOpen, setIsOpen] = useState(false);

  const openGuideHandler = () => {
    setIsOpen(true);
  };
  const closeGuideHandler = () => {
    setIsOpen(false);
  };

  if (!isOpen)
    return (
      <GuideClose
        className={classes["position"]}
        isDarkMode={isDarkMode}
        onClick={openGuideHandler}
      />
    );

  return (
    <GuideOpen
      isHome
      isScroll
      isCancel
      className={classes["position"]}
      isDarkMode={isDarkMode}
      onClose={closeGuideHandler}
      topics={topics}
    />
  );
}

export default Guide;
