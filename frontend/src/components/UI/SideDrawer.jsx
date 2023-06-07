import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";

function SideDrawer({ show, className, onClick, onCancel, children }) {
  const sideDrawerContent = ReactDOM.createPortal(
    <aside
      className={`fixed left-0 top-0 z-20 h-full w-[300px] bg-gray-100 shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </aside>,
    document.getElementById("drawer")
  );
  return (
    <>
      {show && <Backdrop onClick={onCancel} />}
      <CSSTransition
        in={show}
        timeout={{ enter: 1000, exit: 500 }}
        classNames={{
          enter: "opacity-0 transform -translate-x-full",
          enterActive:
            "opacity-100 transform -translate-x-0 transition-all duration-1000",
          exitActive:
            "opacity-100 transform -translate-x-full transition-all duration-500",
          exitDoone: "opacity-0 transform -translate-x-full",
        }}
        mountOnEnter
        unmountOnExit
      >
        <>{sideDrawerContent}</>
      </CSSTransition>
    </>
  );
}

export default SideDrawer;
