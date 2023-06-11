import { useEffect, useState } from "react";
import { Form, Link, useRouteLoaderData } from "react-router-dom";
import Avatar from "./Avatar";
import NavItem from "./NavItem";
import Hamburger from "./Hamburger";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";

import NavSideDrawer from "./NavSideDrawer";
import logo from "../../assets/imgs/blog_logo.png";
import defaultImg from "../../assets/imgs/default.jpg";
import { useMediaQuery } from "react-responsive";

function MainNavigation() {
  const token = useRouteLoaderData("root");
  const [isDrawer, setIsDrawer] = useState(false);
  const matches = useMediaQuery({ query: "(min-width: 768px)" });
  const avatar = useSelector((state) => state.auth.avatar);

  useEffect(() => {
    if (matches) setIsDrawer(false);
  }, [matches]);

  return (
    <header className="w-full items-center bg-blue-500">
      <nav className="lg mx-auto flex h-20 max-h-20 w-full justify-between bg-navy-800 px-6 py-4">
        <NavSideDrawer show={isDrawer} onCancel={() => setIsDrawer(false)} />
        <Hamburger
          className="block md:hidden"
          onClick={() => setIsDrawer(true)}
        />
        <div className="min-w-20 relative w-20">
          <Link to="/" className="absolute -top-2">
            <img src={logo} className="object-contain" alt="logo" />
          </Link>
        </div>
        <div className="hidden md:flex">
          <SearchBar />
          <ul className="flex items-center">
            <NavItem text="Posts" to={"/"} />
            {token && <NavItem text="New Post" to={"/new"} />}
            <NavItem text="About" to={"/about"} />
            {!token && <NavItem text="Login" to={"/auth?mode=login"} />}
            {token && (
              <li className="flex-1 py-2 md:w-16 md:px-1 md:text-sm lg:w-28 lg:px-4 lg:text-base">
                <Form method="post" action="/logout">
                  <button className="w-full">Logout</button>
                </Form>
              </li>
            )}
            <Link to={token ? "/profile" : "/auth?mode=login"}>
              <Avatar
                className={
                  "border-2 border-white md:mx-2 md:h-[42px] md:w-[42px] lg:mx-4 lg:h-[52px] lg:w-[52px]"
                }
                avatar={token ? avatar : defaultImg}
              />
            </Link>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default MainNavigation;
