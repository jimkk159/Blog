import React, { useState } from "react";

//Custom Comonent
import ScrollAnimation from "../Animation/ScrollAnimation";

function ScrollOpenClose({ className, openItem, closeItem }) {
  const [isOpen, setIsOpen] = useState(false);

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  if (!isOpen && closeItem)
    return (
      <ScrollAnimation className={className}>
        {React.cloneElement(closeItem, { onOpen: openHandler })}
      </ScrollAnimation>
    );

  if (openItem)
    return (
      <ScrollAnimation className={className} top="20%">
        {React.cloneElement(openItem, { onClose: closeHandler })}
      </ScrollAnimation>
    );
}

export default ScrollOpenClose;
