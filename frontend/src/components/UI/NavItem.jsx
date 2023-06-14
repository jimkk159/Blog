import { NavLink } from "react-router-dom";

function NavItem({ text, to, end }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          "mx-2 flex items-end whitespace-nowrap text-sm md:py-1 lg:p-2 lg:text-sm " +
          `${isActive ? "text-self-pink" : ""}`
        }
      >
        {text}
      </NavLink>
    </li>
  );
}

export default NavItem;
