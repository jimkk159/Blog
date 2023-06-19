import { useRef, useState, useCallback } from "react";
import { Form, useNavigation } from "react-router-dom";

// components
import Button from "../UI/Button";

// helper
import * as authHelper from "../../utils/auth";

function EditPostModal({
  method,
  show,
  title,
  content,
  onSave,
  onTitle,
  onCancel,
  selectCategory,
}) {
  const token = authHelper.getAuthToken();

  const previewImgtRef = useRef(null);
  const [isDrop, setIsDrop] = useState(false);
  const [previewImg, setPreviewImg] = useState(undefined);
  const [previewImgStyle, setPreviewImgStyle] = useState(0);

  // react-router
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const previewImgDnDBlock = (
    <>
      <label htmlFor="preview" className="h-6">
        Preview image
      </label>
      <div className="flex">
        <div
          className="relative box-border flex h-48 w-48 cursor-pointer items-center justify-center border border-r-0 border-gray-300"
          onClick={() => {
            previewImgtRef.current.click();
          }}
        >
          <p className="absolute right-[calc(50%-16px)] top-[calc(50%-16px)] h-8 w-8 text-center text-2xl text-gray-300">
            +
          </p>
          {previewImg && (
            <img
              alt="preview"
              className="h-full w-full object-cover"
              src={previewImg}
            />
          )}
        </div>
        <div
          className="flex w-4 cursor-pointer items-center justify-center border border-zinc-400 bg-gray-200"
          onClick={() => setPreviewImgStyle(1)}
        >
          {">"}
        </div>
      </div>
    </>
  );

  const previewImgURLBlock = (
    <>
      <label htmlFor="preview" className="h-6">
        Preview image URL
      </label>
      <div className="flex">
        <div
          className="flex w-4 items-center justify-center border border-zinc-400 bg-gray-200"
          onClick={() => setPreviewImgStyle(0)}
        >
          {"<"}
        </div>
        <div className="box-border flex h-48 w-48 flex-col  items-start justify-start pr-4">
          <div className="h-52 rounded-sm border border-gray-300 p-2">
            <textarea
              id="previewImg"
              className="w-full resize-none border-0 bg-transparent focus:outline-none"
              rows="7"
              placeholder="Put your image url here"
              value={previewImg}
              onChange={(e) => setPreviewImg(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );

  const updatePreviewImgHander = useCallback(
    async (event) => {
      if (event.target.files && event.target.files.length === 1) {
        const previewImg = event.target.files[0];

        const previewImgForm = new FormData();
        previewImgForm.append("img", previewImg);

        const resoponse = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/api/v1/img",
          {
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            body: previewImgForm,
          }
        ).catch((err) => err);

        const uploadedImg = (await resoponse.json()).data.img;
        setPreviewImg(uploadedImg);
      }
    },
    [token]
  );

  return (
    show && (
      <div
        className={`fixed left-0 top-0 z-20 h-full w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex h-screen w-full items-center justify-center bg-black bg-opacity-75"
          onClick={() => onCancel()}
        >
          <Form
            method={method}
            onClick={(e) => {
              e.stopPropagation();
              if (isDrop) setIsDrop(false);
            }}
            onBlur={() => setIsDrop(false)}
            className="h-92 w-[520px] rounded bg-white text-black"
          >
            <textarea
              type="text"
              name="content"
              className="hidden"
              value={content}
              onChange={() => {}}
            />
            <input
              type="text"
              name="previewImg"
              className="hidden"
              value={previewImg}
              onChange={setPreviewImg}
            />
            <input
              ref={previewImgtRef}
              type="file"
              accept=".jpg,.png,.jpeg,.jfif,.gif"
              className="hidden"
              onChange={updatePreviewImgHander}
            />
            <div className="flex w-full flex-col items-center p-2 font-IBM-plex-serif">
              <div className="mt-2 border-b border-gray-400">
                <h1 className="font-bree-serif text-xl capitalize">
                  one more step
                </h1>
              </div>
              <div className="flex h-64 w-full justify-between p-4 pb-2">
                <div className="flex items-center justify-center after:h-4/5 after:w-3 after:border-r-2">
                  <div className="flex items-center justify-center bg-orange-500 ">
                    <div className="flex flex-col items-center space-y-1 bg-white">
                      {previewImgStyle
                        ? previewImgURLBlock
                        : previewImgDnDBlock}
                    </div>
                  </div>
                </div>
                <div className="flex w-1/2 flex-col items-start space-y-3 bg-white font-pt-serif">
                  <div className="flex flex-nowrap space-x-1 overflow-auto">
                    <label htmlFor="title">Title:</label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      required
                      className="w-full border-b border-gray-400 leading-none outline-none focus:bg-gray-50"
                      value={title}
                      onChange={onTitle}
                    />
                  </div>
                  <div className="flex flex-nowrap items-center justify-center space-x-1 overflow-auto">
                    <label htmlFor="category">Topic:</label>
                    <div className="w-32">{selectCategory}</div>
                  </div>
                  <div className="flex w-full flex-col space-y-1 leading-tight">
                    <label>Summary:</label>
                    <div className="mt-1 h-[126px] rounded border border-gray-300 p-2">
                      <textarea
                        id="summary"
                        name="summary"
                        className="w-full resize-none border-0 bg-transparent focus:outline-none"
                        rows="4"
                        placeholder="Write your summary here"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-end px-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="ml-4 rounded-xl bg-blue-500 px-4 py-1.5 text-white shadow-xl hover:bg-blue-600"
                  spinner={{ color: "text-white" }}
                  onClick={onSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  );
}

export default EditPostModal;
