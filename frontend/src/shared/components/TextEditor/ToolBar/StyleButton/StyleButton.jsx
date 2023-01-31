import React, { useRef } from "react";

//CSS
import classes from "./StyleButton.module.css";

function StyleButton(props) {
  const { active, disable, opt, onChange, isDarkMode, style, label, icon } =
    props;
  const inputRef = useRef(null);

  //Check button active
  let buttonClassName = classes["item"];
  if (disable) {
    buttonClassName += ` ${classes["item-disable"]}`;
    buttonClassName += isDarkMode
      ? ` ${classes["item-disable-dark"]}`
      : ` ${classes["item-disable-light"]}`;
  } else if (active) {
    buttonClassName += ` ${classes["item-normal"]} ${classes["item-active"]}`;
    buttonClassName += isDarkMode
      ? ` ${classes["item-dark"]} ${classes["item-dark-active"]}`
      : ` ${classes["item-light"]} ${classes["item-light-active"]}`;
  } else {
    buttonClassName += ` ${classes["item-normal"]} ${
      isDarkMode ? classes["item-dark"] : classes["item-light"]
    }`;
  }

  //Press Button
  const toggleHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    switch (opt) {
      //Mouse Click to pick an Image(Pick Image => Update Editor State)
      case "image":
        inputRef.current.click();
        break;

      default:
        let onChangeFn;
        switch (typeof onChange) {
          case "function":
            onChangeFn = onChange;
            onChangeFn(style);
            break;
          case "object":
            onChangeFn = onChange[opt];
            if (onChangeFn) onChangeFn();
            break;
          default:
            break;
        }
    }
  };

  //Image
  const selectImage = (event) => {
    //To Do if the Image is same, it won't update image twice
    let pickedFile;
    const updateImage = (inputImage) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        onChange(fileReader.result, pickedFile);
      };
      fileReader.readAsDataURL(inputImage);
      return;
    };
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      updateImage(pickedFile);
    }
  };

  return (
    <>
      <div
        className={`${buttonClassName}`}
        onMouseDown={!disable ? toggleHandler : null}
        title={label}
        aria-label={label}
      >
        {icon || label}
      </div>
      {opt === "image" && (
        <input
          id="upload-image"
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          accept=".jpg,.png,.jpeg,.jfif,.gif"
          onChange={selectImage}
        />
      )}
    </>
  );
}

export default StyleButton;
