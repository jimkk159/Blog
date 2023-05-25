import React from "react";
import * as authHelper from "../../utils/auth";

//CSS
import defaultImg from "../../assets/imgs/default.jpg";

function Avatar({ className, onClick, avatar: img, children }) {
  const token = authHelper.getAuthToken();

  const avatar = token && img ? img : defaultImg;

  return (
    <div
      className={`relative ${className} overflow-hidden rounded-full after:inline-block after:h-0 after:w-full after:pt-[100%] after:align-top`}
      onClick={onClick}
    >
      <img
        className="absolute left-0 top-0 h-full w-full object-cover"
        src={avatar}
        alt="avatar"
      />
      {children}
    </div>
  );
}

export default Avatar;
