import { NavLink } from "react-router-dom";

function NavItem({ text, to }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          "m-4 flex items-end px-4" + `${isActive ? "" : " py-2"}`
        }
      >
        {text}
      </NavLink>
    </li>
  );
}

export default NavItem;
