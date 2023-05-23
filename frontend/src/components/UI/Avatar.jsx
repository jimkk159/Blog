import React from "react";
import * as authHelper from "../../utils/auth";

//CSS
import defaultImg from "../../assets/imgs/default.jpg";

function Avatar({ className, onClick, avatar: img }) {
  const token = authHelper.getAuthToken();

  const avatar = token && img ? img : defaultImg;

  return (
    <div
      className={`overflow-hidden rounded-full ${className}`}
      onClick={onClick}
    >
      <img className="h-full w-full object-cover" src={avatar} alt="avatar" />
    </div>
  );
}

export default Avatar;
