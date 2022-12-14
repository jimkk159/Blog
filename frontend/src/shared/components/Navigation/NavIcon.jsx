import { cloneElement } from "react";

function NavIcon(props) {
  if (!props.icon) return;
  console.log(props.className);
  return cloneElement(props.icon, {
    className: props.className,
    style: props.style,
  });
}

export default NavIcon;

//reference:https://www.youtube.com/watch?v=4W8Jy21R05M
