import Avatar from "./Avatar";
import SideDrawer from "./SideDrawer";
import { useSelector } from "react-redux";
import defaultImg from "../../assets/imgs/default.jpg";
import { Link, useRouteLoaderData } from "react-router-dom";
import SearchBarSide from "./SearchBarSide";

import {
  BsPencilFill,
  BsPersonCircle,
  BsFillFileEarmarkPostFill,
} from "react-icons/bs";
import { SiNodemon } from "react-icons/si";
import BoxItem from "./BoxItem";
import { BiLogIn, BiLogOut } from "react-icons/bi";

function NavSideDrawer({ show, className, onCancel }) {
  // react-router
  const token = useRouteLoaderData("root");

  // redux
  const avatar = useSelector((state) => state.auth.avatar);

  return (
    <SideDrawer show={show} className={className} onCancel={onCancel}>
      <>
        <div className="h-4 border-b border-white bg-purple-500" />
        <div
          className={`py-auto flex h-20 items-center justify-between bg-red-500 px-2`}
        >
          <Link
            to={token ? "/profile" : "/auth?mode=login"}
            onClick={() => onCancel()}
          >
            <Avatar
              className={"mx-4 h-[50px] w-[50px] border-2 border-white"}
              avatar={token ? avatar : defaultImg}
            />
          </Link>
          <SearchBarSide onSearch={() => onCancel()} />
        </div>
        <div className="flex justify-center p-8">
          <div className="flex flex-wrap justify-start space-y-4">
            <div className="flex space-x-4">
              <BoxItem
                to="/posts"
                icon={
                  <BsFillFileEarmarkPostFill className="h-full w-full text-orange-400" />
                }
                onClick={() => onCancel()}
              >
                Posts
              </BoxItem>
              {!token && (
                <BoxItem
                  to="/auth?mode=login"
                  icon={<BiLogIn className="h-full w-full text-orange-400" />}
                  onClick={() => onCancel()}
                >
                  Login
                </BoxItem>
              )}
              {token && (
                <BoxItem
                  action="/logout"
                  icon={<BiLogOut className="h-full w-full text-orange-400" />}
                  onClick={() => onCancel()}
                >
                  Logout
                </BoxItem>
              )}
            </div>
            {token && (
              <div className="flex space-x-4">
                <BoxItem
                  to="/posts/new"
                  icon={
                    <BsPencilFill className="h-full w-full text-orange-400" />
                  }
                  onClick={() => onCancel()}
                >
                  New
                </BoxItem>
                <BoxItem
                  to={token ? "/profile" : "/auth?mode=login"}
                  icon={
                    <BsPersonCircle className="h-full w-full text-orange-400" />
                  }
                  onClick={() => onCancel()}
                >
                  Profile
                </BoxItem>
              </div>
            )}
            <div className="flex space-x-4">
              <BoxItem
                to="/about"
                icon={<SiNodemon className="h-full w-full text-orange-400" />}
                onClick={() => onCancel()}
              >
                About
              </BoxItem>
            </div>
          </div>
        </div>
      </>
    </SideDrawer>
  );
}

export default NavSideDrawer;
