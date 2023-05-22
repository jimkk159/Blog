import React from "react";
import * as authHelper from "../../utils/auth";

//CSS
import defaultImg from "../../assets/imgs/default.jpg";

function Avatar({ className, onClick }) {
  const token = authHelper.getAuthToken();
  const img = token
    ? "https://cdn.britannica.com/53/93653-050-B00E1D0C/Fishing-boats-harbour-Digby-NS.jpg"
    : defaultImg;

  return (
    <div
      className={`overflow-hidden rounded-full ${className}`}
      onClick={onClick}
    >
      <img className="h-full w-full object-cover" src={img} alt="avatar" />
    </div>
  );
}

export default Avatar;
