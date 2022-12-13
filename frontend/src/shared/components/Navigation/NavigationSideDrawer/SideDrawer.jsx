import React from "react";

//CSS
import classes from "./SideDrawer.module.css";

//Custom Component
import SideDrawer from "../../UI/SideDrawer";
import NavigationItems from "../NavigationItems";
import SideDrawerTitle from "./SideDrawerTitle"

function NavigationSideDrawer(props) {
  return (
    <SideDrawer onCancel={props.onClick}>
      <SideDrawerTitle onCancel={props.onClick}/>
      <nav className={`${classes.navigation__drawer} ${classes.navigation__drawer}`}>
        <NavigationItems />
      </nav>
    </SideDrawer>
  );
}

export default NavigationSideDrawer;
