import { NavLink } from "react-router-dom";

function NavItem({ text, to, end }) {
  return (
    <li className="list-none">
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          "mx-2 flex items-end whitespace-nowrap text-sm hover:text-self-pink-600 md:py-1 lg:p-2 lg:text-sm " +
          `${isActive ? "text-self-pink-500" : ""}`
        }
      >
        {text}
      </NavLink>
    </li>
  );
}

export default NavItem;
