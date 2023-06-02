import { NavLink } from "react-router-dom";

function NavItem({ text, to }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          "mx-2 flex items-end py-2 px-4 whitespace-nowrap" +
          `${isActive ? " border " : ""}`
        }
      >
        {text}
      </NavLink>
    </li>
  );
}

export default NavItem;
