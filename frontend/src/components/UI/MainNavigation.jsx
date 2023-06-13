import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Form, Link, useRouteLoaderData } from "react-router-dom";

// imgs
import logo from "../../assets/imgs/blog_logo.png";
import defaultImg from "../../assets/imgs/default.jpg";

// components
import Avatar from "./Avatar";
import NavItem from "./NavItem";
import Hamburger from "./Hamburger";
import SearchBar from "./SearchBar";
import NavSideDrawer from "./NavSideDrawer";

function MainNavigation() {
  const [isDrawer, setIsDrawer] = useState(false);
  
  // redux
  const avatar = useSelector((state) => state.auth.avatar);
  
  // react-router
  const token = useRouteLoaderData("root");
  
  // import hooks
  const matches = useMediaQuery({ query: "(min-width: 768px)" });

  // useEffect
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
            <NavItem text="Posts" to={"/posts"} end />
            {token && <NavItem text="New Post" to={"/posts/new"} />}
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
