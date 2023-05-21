import { Form, Link, NavLink, useRouteLoaderData } from "react-router-dom";
import SearchBar from "./SearchBar";
import NavItem from "./NavItem";

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <header className="items-center">
      <nav className="lg mx-auto flex justify-between px-1">
        <h1 className="m-4 self-center p-1">
          <Link to="/" className="m-4 text-2xl">
            Blog
          </Link>
        </h1>
        <div className="flex">
          <SearchBar />
          <ul className="m-0 flex  p-0">
            <NavItem text="Posts" to={"/"} />
            {token && <NavItem text="New Post" to={"/new"} />}
            <NavItem text="About" to={"/about"} />
            {!token && <NavItem text="Login" to={"/auth?mode=login"} />}
            {token && (
              <li>
                <Form method="post" action="/logout">
                  <button>Logout</button>
                </Form>
              </li>
            )}
            {token && <NavItem text="Profile" to={"/profile"} />}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default MainNavigation;
