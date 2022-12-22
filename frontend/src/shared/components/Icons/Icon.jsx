import { cloneElement } from "react";

function Icon(props) {
  if (!props.icon) return;
  return cloneElement(props.icon, {
    className: props.className,
    style: props.style,
  });
}

export default Icon;

//reference:https://www.youtube.com/watch?v=4W8Jy21R05M
