import React from "react";
import defaultImg from "../../assets/imgs/default.jpg";

function Avatar({ title, className, onClick, avatar: img, children }) {
  const avatar = img ? img : defaultImg;
  return (
    <div
      title={title}
      className={`after:pt-full relative overflow-hidden rounded-full after:inline-block after:h-0 after:w-full after:align-top ${className}`}
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
