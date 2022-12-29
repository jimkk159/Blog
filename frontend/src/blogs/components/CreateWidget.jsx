import React from "react";

//Custom Comonent
import Image from "./Widget/Image";
import Section from "./Widget/Section";
import PostList from "./Widget/PostList";
import Seperation from "./Widget/Seperation";
import Description from "./Widget/Description";
import EmphasizeTitle from "./Widget/EmphasizeTitle";

function CreateWidget(props) {
  const { isDarkMode, widget } = props;

  if (widget.type === "emphasize")
    return <EmphasizeTitle isDarkMode={isDarkMode} content={widget.content} />;
  if (widget.type === "seperation")
    return <Seperation isDarkMode={isDarkMode} />;
  if (widget.type === "description")
    return <Description content={widget.content} />;
  if (widget.type === "list") return <PostList content={widget.content} />;
  if (widget.type === "img")
    return (
      <Image
        type="post-img"
        alt={widget.content.alt}
        img={widget.content.img}
        description={widget.content.description}
        isDarkMode={isDarkMode}
      />
    );
  if (widget.type === "section") {
    return (
      <Section
        isDarkMode={isDarkMode}
        title={widget.content.title}
        short={widget.content.short}
        structure={widget.content.structure}
      />
    );
  }
  return null;
}

export default CreateWidget;
