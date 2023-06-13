import { NavLink } from "react-router-dom";

function NavItem({ text, to, end }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          "mx-2 flex items-end whitespace-nowrap md:mx-1 md:px-2 md:py-1 md:text-sm lg:px-4 lg:py-2 lg:text-base" +
          `${isActive ? " border " : ""}`
        }
      >
        {text}
      </NavLink>
    </li>
  );
}

export default NavItem;
