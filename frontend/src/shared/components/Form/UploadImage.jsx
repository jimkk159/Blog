import React, { useRef, useState, useEffect } from "react";

//CSS
import classes from "./UploadImage.module.css";

function UploadImage(props) {
  const { isDrag, setIsDrag } = props;

  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  //Mouse Click to pick an Image
  const pickHandler = () => {
    inputRef.current.click();
  };

  //Handle Select to upload image
  const iputImageHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid; //State not update instantly
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setImage(pickedFile);
      setIsValid(true);
      fileIsValid = true;
      props.onInput(props.id, pickedFile, fileIsValid);
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
      setIsDrag(true);
    } else if (event.type === "dragleave") {
      setIsDrag(false);
    }
  };

  //Drop to upload an Image
  const dropHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let pickedFile;
    let fileIsValid = isValid; //State not update instantly
    setIsDrag(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
      pickedFile = event.dataTransfer.files[0];
      setImage(pickedFile);
      setIsValid(true);
      fileIsValid = true;
      props.onInput(props.id, pickedFile, fileIsValid);
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
          id={props.id}
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
          accept=".jpg,.png,.jpeg,.jfif"
          onChange={iputImageHandler}
        />
        <div className={`${classes["upload-container"]}`}>
          <div
            className={`${classes["upload-preview"]} ${
              props.isDarkMode
                ? classes["upload-preview-dark"]
                : classes["upload-preview-light"]
            }`}
            onClick={pickHandler}
          >
            {previewUrl && <img src={previewUrl} alt="preview" />}
            {!previewUrl && <p className={`${classes["upload-img"]}`}>+</p>}
          </div>
        </div>
        {!isValid && <p>{props.errorMessage}</p>}
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
