import { Form, Link, useRouteLoaderData } from "react-router-dom";
import Avatar from "./Avatar";
import NavItem from "./NavItem";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";

import logo from "../../assets/imgs/blog_logo.png";
import defaultImg from "../../assets/imgs/default.jpg";

function MainNavigation() {
  const token = useRouteLoaderData("root");
  const avatar = useSelector((state) => state.auth.avatar);

  return (
    <header className="w-full items-center bg-blue-500">
      <nav className="lg mx-auto flex h-20 max-h-20 w-full justify-between bg-navy-800 px-1 py-4">
        <div className="min-w-20 relative ml-8 w-20">
          <Link to="/" className="absolute -top-2">
            <img src={logo} className="object-contain" alt="logo" />
          </Link>
        </div>
        <div className="flex">
          <SearchBar />
          <ul className="flex items-center">
            <NavItem text="Posts" to={"/"} />
            {token && <NavItem text="New Post" to={"/new"} />}
            <NavItem text="About" to={"/about"} />
            {!token && <NavItem text="Login" to={"/auth?mode=login"} />}
            {token && (
              <li className="w-28 flex-1 px-4 py-2">
                <Form method="post" action="/logout">
                  <button className="w-full">Logout</button>
                </Form>
              </li>
            )}
            <Link to={token ? "/profile" : "/auth?mode=login"}>
              <Avatar
                className={"mx-4 h-[50px] w-[50px]"}
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