import React from "react";

//Custom Component
import Rectangle from "./Rectangle";

function Tree(props) {
  return (
    <div onClick={props.onClick}>
      <Rectangle content={123} />
    </div>
  );
}

export default Tree;
