import React, { useRef, useState, useEffect } from "react";

//CSS
import classes from "./UploadImage.module.css";

function UploadImage(props) {
  const {
    id: inputId,
    className,
    ratioClassName,
    isDarkMode,
    isDrag,
    onDrag,
    onInput,
    onUpdate,
    errorMessage,
    placeholder,
  } = props;

  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  //Mouse Click to pick an Image
  const pickHandler = () => {
    inputRef.current.click();
  };

  //Handle Select to upload image
  const inputImageHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid; //State not update instantly
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setImage(pickedFile);
      setIsValid(true);
      fileIsValid = true;
      if (onInput) {
        onInput(inputId, pickedFile, fileIsValid);
      }
      if (onUpdate) {
        onUpdate(pickedFile);
      }
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
  };

  //Drag trigger to start upload an Image
  const dragHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      onDrag(true);
    } else if (event.type === "dragleave") {
      onDrag(false);
    }
  };

  //Drop to upload an Image
  const dropHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let pickedFile;
    let fileIsValid = isValid; //State not update instantly
    onDrag(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
      pickedFile = event.dataTransfer.files[0];
      setImage(pickedFile);
      setIsValid(true);
      fileIsValid = true;
      if (onInput) {
        onInput(inputId, pickedFile, fileIsValid);
      }
      if (onUpdate) {
        onUpdate(pickedFile);
      }
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
  };

  //Update preview when image upload
  useEffect(() => {
    if (!image) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(image);
  }, [image]);

  return (
    <>
      <div className={classes["input-control"]}>
        <input
          id={inputId}
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
          accept=".jpg,.png,.jpeg,.jfif,.gif"
          onChange={inputImageHandler}
        />
        <div className={`${classes["upload-container"]} ${className}`}>
          <div className={`${classes["upload-dummy"]} ${ratioClassName}`}></div>
          <div
            className={`${classes["upload-preview"]} ${
              isDarkMode
                ? classes["upload-preview-dark"]
                : classes["upload-preview-light"]
            }`}
            onClick={pickHandler}
          >
            {previewUrl && <img src={previewUrl} alt="preview" />}
            {!previewUrl && (
              <p className={`${classes["upload-img"]}`}>{placeholder}</p>
            )}
          </div>
        </div>
        {!isValid && <p>{errorMessage}</p>}
      </div>
      {isDrag && (
        <div
          className={`${classes["upload-drag-element"]}`}
          onDrop={dropHandler}
          onDragEnter={dragHandler}
          onDragOver={dragHandler}
          onDragLeave={dragHandler}
        ></div>
      )}
    </>
  );
}

export default UploadImage;
