//Judge the button active
export const checkActive = (style, active) => {
  let isActive = style === active;
  if (typeof active === "function") {
    isActive = active(style);
  }
  return isActive;
};
