import { Form, Link, useRouteLoaderData } from "react-router-dom";
import Avatar from "./UI/Avatar";
import NavItem from "./NavItem";
import SearchBar from "./SearchBar";

import logo from "../assets/imgs/blog_logo.png";

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <header className="items-center">
      <nav className="lg mx-auto flex h-20 max-h-20 justify-between bg-navy-800 px-1 py-4">
        <div className="">
          <div className="min-w-20 relative ml-8 w-20">
            <Link to="/" className="absolute -top-2">
              <img src={logo} className="object-contain" alt="logo" />
            </Link>
          </div>
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
            <Link to="/profile">
              <Avatar className={"mx-4 h-[50px] w-[50px]"}/>
            </Link>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default MainNavigation;
