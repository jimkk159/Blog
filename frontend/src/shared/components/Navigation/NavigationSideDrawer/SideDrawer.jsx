import React from "react";

//Custom Component
import SideDrawer from "../../UI/SideDrawer";
import NavigationItems from "../NavigationItems";
import SideDrawerTitle from "./SideDrawerTitle";

//CSS
import classes from "./SideDrawer.module.css";

function NavigationSideDrawer(props) {
  return (
    <SideDrawer onCancel={props.onClick}>
      <SideDrawerTitle onCancel={props.onClick} />
      <nav
        className={`${classes.navigation__drawer} ${classes.navigation__drawer}`}
      >
        <NavigationItems iconClassName={classes["navigation__drawer-icon"]} />
      </nav>
    </SideDrawer>
  );
}

export default NavigationSideDrawer;
