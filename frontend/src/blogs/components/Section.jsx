import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

//Custom Component
import Card from "../../shared/components/UI/Card";
import SubTitle from "../components/Widget/SubTitle";
import Description from "../components/Widget/Description";

//CSS
import classes from "./Section.module.css";

function Section(props) {
  const { title, short, content, children, isDarkMode } = props;
  const [isOpen, setIsOpen] = useState(false);

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };
  let detail = (
    <>
      <IoIosArrowUp className={`${classes["toggle"]}`} onClick={closeHandler} />
      <SubTitle content={title} />
      <hr className={classes["title-hr"]} />
      {children}
    </>
  );

  if (!isOpen)
    detail = (
      <>
        <IoIosArrowDown
          className={`${classes["toggle"]}`}
          onClick={openHandler}
        />
        <SubTitle content={title} />
        <Description content={short.slice(0, 500) + "..."} />
      </>
    );

  if (content)
    detail = (
      <>
        <IoIosArrowUp
          className={`${classes["toggle"]}`}
          onClick={closeHandler}
        />
        <SubTitle content={title} />
        <hr className={classes["title-hr"]} />
        {content}
      </>
    );

  return (
    <Card
      className={`${classes["section"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
    >
      {detail}
    </Card>
  );
}

export default Section;
