import React, { useState } from "react";

//Custom Comonent
import GuideOpen from "./GuideOpen";
import GuideClose from "./GuideClose";

//CSS
import classes from "./Guide.module.css";

function Guide(props) {
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
        isDarkMode={props.isDarkMode}
        onClick={openGuideHandler}
      />
    );

  return (
    <GuideOpen
      className={classes["position"]}
      isDarkMode={props.isDarkMode}
      onClose={closeGuideHandler}
      topicRelation={props.topicRelation}
    />
  );
}

export default Guide;
