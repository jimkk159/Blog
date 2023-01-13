import React, { useRef, useState, useEffect } from "react";

//CSS
import classes from "./StyleButton.module.css";

function StyleButton(props) {
  const { onChange } = props;
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [height, setHeight] = useState("auto");
  const [width, setWidth] = useState("auto");

  //Check button active
  let buttonClassName = classes["item"];
  if (props.disable) {
    buttonClassName += ` ${classes["item-disable"]}`;
    buttonClassName += props.isDarkMode
      ? ` ${classes["item-disable-dark"]}`
      : ` ${classes["item-disable-light"]}`;
  } else if (props.active) {
    buttonClassName += ` ${classes["item-normal"]} ${classes["item-active"]}`;
    buttonClassName += props.isDarkMode
      ? ` ${classes["item-dark"]} ${classes["item-dark-active"]}`
      : ` ${classes["item-light"]} ${classes["item-light-active"]}`;
  } else {
    buttonClassName += ` ${classes["item-normal"]} ${
      props.isDarkMode ? classes["item-dark"] : classes["item-light"]
    }`;
  }

  //Press Button
  const toggleHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let onChangeFn;
    switch (typeof props.onChange) {
      case "function":
        onChangeFn = props.onChange;
        onChangeFn(props.style);
        break;
      case "object":
        onChangeFn = props.onChange[props.opt];
        if (onChangeFn) onChangeFn();
        break;
      default:
        break;
    }
    //Mouse Click to pick an Image
    if (props.opt === "image") {
      inputRef.current.click();
    }
  };

  //Image
  const selectImage = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setImage(pickedFile);
    }
  };

  // const addImageFromState = () => {
  //   if (!isNaN(height)) {
  //     setHeight(`${height}px`);
  //   }
  //   if (!isNaN(width)) {
  //     setWidth(`${width}px`);
  //   }
  //   console.log(previewUrl);
  //   props.onChange(previewUrl, height, width);
  // };

  //Update preview when image upload
  useEffect(() => {
    if (!image) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(image);
  }, [image]);

  useEffect(() => {
    if (!isNaN(height)) {
      setHeight(`${height}px`);
    }
    if (!isNaN(width)) {
      setWidth(`${width}px`);
    }
    if (onChange) {
      onChange(previewUrl, height, width);
    }
  }, [width, height, previewUrl]);

  return (
    <>
      <div
        className={`${buttonClassName}`}
        onMouseDown={!props.disable ? toggleHandler : null}
        title={props.label}
        aria-label={props.label}
      >
        {props.icon || props.label}
      </div>
      {props.opt === "image" && (
        <input
          id="upload-image"
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          accept=".jpg,.png,.jpeg,.jfif"
          onChange={selectImage}
        />
      )}
    </>
  );
}

export default StyleButton;
