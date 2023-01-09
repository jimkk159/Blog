import React, { useRef, useState } from "react";

//CSS
import classes from "./LinkModal.module.css";

function LinkModal(props) {
  const urlRef = useRef(null);
  const [url, setUrl] = useState("");

  const preventMouseDowonHanlder = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const changeUrlHandler = (event) => {
    setUrl(event.target.value);
  };
  const startChangeUrlHandler = () => {
    urlRef.current.focus();
  };

  const addLinkHandler = (event) => {
    event.stopPropagation();
    props.onAddLink(url)
    setUrl("")
    props.onClose();
  };
  const cancelHandler = (event) => {
    event.stopPropagation();
    setUrl("")
    props.onClose();
  };

  return (
    <div
      className={classes["link-modal"]}
      onMouseDown={preventMouseDowonHanlder}
    >
      <label className={classes["link-title"]}>Link URL</label>
      <input
        id="linkURL"
        ref={urlRef}
        className={classes["link-input"]}
        value={url}
        onChange={changeUrlHandler}
        onMouseDown={startChangeUrlHandler}
      />
      <span className={classes["link-btn-section"]}>
        <button className={classes["link-btn"]} onMouseDown={addLinkHandler}>
          Add
        </button>
        <button className={classes["link-btn"]} onMouseDown={cancelHandler}>
          Cancel
        </button>
      </span>
    </div>
  );
}

export default LinkModal;
