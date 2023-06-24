import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Form, Link, useRouteLoaderData } from "react-router-dom";

// imgs
import logo from "../../assets/imgs/logo.png";
import defaultImg from "../../assets/imgs/default.jpg";

// components
import Avatar from "./Avatar";
import NavItem from "./NavItem";
import Hamburger from "./Hamburger";
import SearchBar2 from "./SearchBar2";
import NavSideDrawer from "./NavSideDrawer";

// hooks
import useScroll from "../../hooks/scorll-hook";

function MainNavigation() {
  const [isDrawer, setIsDrawer] = useState(false);

  // redux
  const avatar = useSelector((state) => state.auth.avatar);

  // react-router
  const { token } = useRouteLoaderData("root");

  // import hooks
  const matches = useMediaQuery({ query: "(min-width: 768px)" });

  // custom hooks
  const { isScrollingDown, scrollPosition } = useScroll();

  // useEffect
  useEffect(() => {
    if (matches) setIsDrawer(false);
  }, [matches]);

  return (
    <>
      <header
        className={`fixed z-10 w-full transition-opacity duration-500 hover:opacity-100 md:relative ${
          matches ? "bg-self-dark" : "bg-white"
        } ${isScrollingDown && scrollPosition > 250 ? "opacity-0" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex h-24 max-h-24 w-full justify-center px-6 py-4">
          <div className="flex h-full w-full max-w-5xl items-center justify-between">
            <NavSideDrawer
              show={isDrawer}
              onCancel={() => setIsDrawer(false)}
            />
            <div className="relative flex w-32 min-w-[80px] items-center justify-center">
              <Link to="/" className="-ml-10">
                <img
                  src={logo}
                  className="h-20 w-20 object-contain"
                  alt="logo"
                />
              </Link>
            </div>
            <Hamburger
              className="block justify-center md:hidden"
              onClick={() => setIsDrawer((prev) => !prev)}
            />
            <div className="hidden h-full w-full justify-between md:flex">
              <SearchBar2 />
              <ul
                className={`flex w-full items-center justify-end ${
                  token ? "" : "md:space-x-2"
                } lg:space-x-4`}
              >
                <NavItem text="Home" to={"/"} end />
                <NavItem text="Browse" to={"/posts"} end />
                {token && <NavItem text="Write" to={"/posts/new"} />}
                <NavItem text="About" to={"/about"} />
                {!token && <NavItem text="Login" to={"/auth?mode=login"} />}
                {token && (
                  <li className="mx-2 flex items-end whitespace-nowrap text-sm md:py-1 lg:p-2 lg:text-sm">
                    <Form method="post" action="/logout">
                      <button className="w-full">Logout</button>
                    </Form>
                  </li>
                )}
                <Link to={token ? "/profile" : "/auth?mode=login"}>
                  <div className="pr-0.25 hover:bg-self-pink flex cursor-pointer flex-row items-center justify-between space-x-1.5 rounded-full bg-self-dark-gray py-1.5 pl-3.5 pr-2 text-xs hover:bg-self-pink-500 lg:space-x-2.5 lg:py-2 lg:pl-6 lg:text-sm">
                    <p>Profile</p>
                    <Avatar
                      className={
                        "border-2 border-white md:h-[24px] md:w-[24px] lg:h-[32px] lg:w-[32px]"
                      }
                      avatar={token ? avatar : defaultImg}
                    />
                  </div>
                </Link>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default MainNavigation;
