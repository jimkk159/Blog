import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

//Custom Component
import SubTitle from "./SubTitle";
import Description from "./Description";
import CreateWidget from "../CreateWidget";
import Card from "../../../shared/components/UI/Card";

//CSS
import classes from "./Section.module.css";

function Section(props) {
  const { title, short, structure, children, isDarkMode } = props;
  const [isOpen, setIsOpen] = useState(false);

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  if (!isOpen)
    return (
      <Card
        className={`${classes["section"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
      >
        <IoIosArrowDown
          className={`${classes["toggle"]}`}
          onClick={openHandler}
        />
        <SubTitle content={title} />
        <Description
          content={short.length > 150 ? short.slice(0, 150) + "..." : short}
        />
      </Card>
    );

  if (structure)
    return (
      <Card
        className={`${classes["section"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
      >
        <IoIosArrowUp
          className={`${classes["toggle"]}`}
          onClick={closeHandler}
        />
        <SubTitle content={title} />
        <hr className={classes["title-hr"]} />
        {structure.map((element, index) => (
          <CreateWidget key={index} isDarkMode={isDarkMode} widget={element} />
        ))}
      </Card>
    );

  return (
    <Card
      className={`${classes["section"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
    >
      <IoIosArrowUp className={`${classes["toggle"]}`} onClick={closeHandler} />
      <SubTitle content={title} />
      <hr className={classes["title-hr"]} />
      {children}
    </Card>
  );
}

export default Section;
