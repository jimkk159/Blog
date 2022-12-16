import React from "react";

//Custom Component
import SideDrawer from "../../UI/SideDrawer";
import NavigationItems from "../NavigationItems";
import SideDrawerTitle from "./SideDrawerTitle";

//CSS
import classes from "./SideDrawer.module.css";
// import "./SideDrawer.css";

function NavigationSideDrawer(props) {
  return (
    <SideDrawer
      onCancel={props.onClick}
      className={props.className}
      show={props.show}
    >
      <SideDrawerTitle onCancel={props.onClick} />
      <nav className={`${props.className} ${classes.navigation__drawer}`}>
        <NavigationItems iconClassName={classes["navigation__drawer-icon"]} />
      </nav>
    </SideDrawer>
  );
}

export default NavigationSideDrawer;
