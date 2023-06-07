import ReactDOM from "react-dom";

function Backdrop({ onClick }) {
  const clickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onClick) onClick();
  };

  const content = (
    <div
      className="fixed left-0 top-0 z-10 h-screen w-full bg-black bg-opacity-75"
      onClick={clickHandler}
    ></div>
  );

  return ReactDOM.createPortal(content, document.getElementById("backdrop"));
}

export default Backdrop;
