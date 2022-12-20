import React, { useContext } from "react";
import { useSelector } from "react-redux";

//Icon
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import CreateIcon from "@mui/icons-material/Create";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

//Custom Context
import { AuthContext } from "../../context/auth-context";
import { LanguageContext } from "../../context/language-context";

//Custom Component
import NavigationItem from "./NavigationItem";

//Custom Hook
import useUuid from "../../hooks/uuid-hook";

//CSS
import classes from "./NavigationItems.module.css";


function NavigationItems(props) {
  const auth = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  
  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  const uuidKeys = useUuid(4);

  return (
    <ul className={classes["nav-links"]}>
      <NavigationItem
        key={"home_" + uuidKeys[0]}
        to="/"
        content={language.home}
        icon={<HomeIcon />}
        iconClassName={props.iconClassName}
        isDarkMode={isDarkMode}
      />
      <NavigationItem
        key={"about_" + uuidKeys[1]}
        to="/about"
        content={language.about}
        icon={<ContactSupportIcon />}
        iconClassName={props.iconClassName}
        isDarkMode={isDarkMode}
      />
      <NavigationItem
        key={"blog_" + uuidKeys[2]}
        to="/blog"
        content={language.blog}
        icon={<CreateIcon />}
        iconClassName={props.iconClassName}
        isDarkMode={isDarkMode}
      />
      <NavigationItem
        key={"logout_" + uuidKeys[3]}
        type="li-button"
        onClick={auth.logout}
        show={auth.isLoggedIn}
        content={language.logout}
        icon={<LogoutIcon />}
        iconClassName={`${props.iconClassName} ${props.logout}`}
        isDarkMode={isDarkMode}
      />
    </ul>
  );
}

export default NavigationItems;
