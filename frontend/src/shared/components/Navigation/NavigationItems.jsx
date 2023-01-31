import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Icon
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import CreateIcon from "@mui/icons-material/Create";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

//Redux Thunk
import { logoutAuto } from "../../../store/auth-thunk";

//Custom Component
import NavigationItem from "./NavigationItem";

//Custom Hook
import useUuid from "../../hooks/uuid-hook";

//CSS
import classes from "./NavigationItems.module.css";

function NavigationItems(props) {
  //Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();

  //React Router
  const navigate = useNavigate();

  //Custom Hook
  const uuidKeys = useUuid(5);

  return (
    <ul className={classes["nav-links"]}>
      <NavigationItem
        key={"home_" + uuidKeys[0]}
        to="/"
        content={language.home}
        icon={<HomeIcon />}
        iconClassName={props.iconClassName}
      />
      <NavigationItem
        key={"about_" + uuidKeys[1]}
        to="/about"
        content={language.about}
        icon={<ContactSupportIcon />}
        iconClassName={props.iconClassName}
      />
      <NavigationItem
        key={"blog_" + uuidKeys[2]}
        to="/blog/new"
        show={isLoggedIn}
        content={language.blog}
        icon={<CreateIcon />}
        iconClassName={props.iconClassName}
      />
      <NavigationItem
        key={"login_" + uuidKeys[3]}
        type="li-button"
        onClick={() => {
          navigate("/auth");
        }}
        show={!isLoggedIn}
        content={language.login}
        icon={<LoginIcon />}
        iconClassName={`${props.iconClassName} ${props.login}`}
      />
      <NavigationItem
        key={"logout_" + uuidKeys[4]}
        type="li-button"
        onClick={() => {
          dispatch(logoutAuto());
        }}
        show={isLoggedIn}
        content={language.logout}
        icon={<LogoutIcon />}
        iconClassName={`${props.iconClassName} ${props.logout}`}
      />
    </ul>
  );
}

export default NavigationItems;
