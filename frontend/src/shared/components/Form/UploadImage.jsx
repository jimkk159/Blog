import React, { useRef, useState, useEffect } from "react";

//CSS
import classes from "./UploadImage.module.css";

function UploadImage(props) {
  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const iputImageHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid; //State not update instantly
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setImage(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  //Pick an Image
  const pickHandler = () => {
    inputRef.current.click();
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
  );
}

export default UploadImage;
