import React, { useRef, useState, useEffect } from "react";

//CSS
import classes from "./UploadImage.module.css";

function UploadImage(props) {
  const {
    id: inputId,
    className,
    initImage,
    ratioClassName,
    isDarkMode,
    isDrag,
    onDrag,
    onInput,
    onUpdate,
    placeholder,
    onPreview,
  } = props;

  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [isUpload, setIsUpload] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();

  //Mouse Click to pick an Image
  const pickHandler = () => {
    inputRef.current.click();
  };

  //Handle Select to upload image
  const inputImageHandler = async (event) => {
    let pickedFile;
    // let fileIsValid = isValid; //State not update instantly
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setImage(pickedFile);
      if (onInput) {
        onInput(inputId, pickedFile, true);
      }
      if (onUpdate) {
        await onUpdate(pickedFile);
      }
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
    onDrag(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
      pickedFile = event.dataTransfer.files[0];
      setImage(pickedFile);
      if (onInput) {
        onInput(inputId, pickedFile, true);
      }
      if (onUpdate) {
        onUpdate(pickedFile);
      }
    } else {
    }
  };

  //Update preview when image upload
  useEffect(() => {
    if (!image) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
      setIsUpload(true);
      if (onPreview) onPreview(fileReader.result);
    };
    fileReader.readAsDataURL(image);
  }, [image, onPreview]);

  useEffect(() => {
    if (initImage) {
      const url = initImage.startsWith("data:image")
        ? initImage
        : `${process.env.REACT_APP_BACKEND_URL}/${initImage}`;
      setPreviewUrl(url);
    } else setPreviewUrl(null);
  }, [initImage]);

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
            } ${!isUpload && classes["upload-edit"]}`}
            onClick={pickHandler}
          >
            {previewUrl && <img src={previewUrl} alt="preview" />}
            {!isUpload && (
              <p className={`${classes["upload-placeholder"]}`}>
                {placeholder}
              </p>
            )}
          </div>
        </div>
        {/* {!isValid && <p>{errorMessage}</p>} */}
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
