import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { LazyMotion, AnimatePresence, domAnimation, m } from "framer-motion";

function SideDrawer({ show, className, onClick, onCancel, children }) {
  const sideDrawerContent = ReactDOM.createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {show && (
          <m.aside
            transition={{ ease: "easeIn", duration: 0.5 }}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`fixed left-0 top-0 z-20 h-full w-[300px] bg-gray-100 shadow-md ${className}`}
            onClick={onClick}
          >
            {children}
          </m.aside>
        )}
      </AnimatePresence>
    </LazyMotion>,
    document.getElementById("drawer")
  );

  return (
    <>
      {show && <Backdrop onClick={onCancel} />}
      {sideDrawerContent}
    </>
  );
}

export default SideDrawer;
