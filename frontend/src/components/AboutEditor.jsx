import MDEditor from "@uiw/react-md-editor";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  Form,
  useNavigate,
  useActionData,
  useNavigation,
} from "react-router-dom";

// components
import Code from "./Plugins";
import Button from "./UI/Button";
import PostWrapper from "./Wrapper/PostWrapper";

// helper
import * as editHelper from "../utils/edit";

function AboutEditor({ method, about }) {
  const inputRef = useRef(null);
  const editorRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // react-router
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // custom functions
  const inputImageHandler = useCallback(async (event) => {
    if (event.target.files && event.target.files.length === 1)
      await editHelper.onImageUpload(event.target.files[0], setMarkdown);
  }, []);

  // Drag and drop
  const startDragHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter") setIsDrag(true);
  };

  const dragHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDrag(true);
    } else if (event.type === "dragleave") setIsDrag(false);
  };

  const dropHandler = useCallback(async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDrag(false);
    await editHelper.onImageDrop(event.dataTransfer, setMarkdown);
  }, []);

  const cancelHandler = () => {
    const alert = window.confirm("Are you sure to abandon and leave?");
    if (alert) {
      navigate(-1);
    }
  };

  const changeEditorHandler = (e) => {
    setMarkdown(e);
    setIsTouched(true);
  };

  // useEffect
  const aboutContent = about?.content ? about.content : "";
  useEffect(() => {
    setMarkdown(aboutContent);
  }, [aboutContent]);

  useEffect(() => {
    if (data && data.message) {
      setIsTouched(false);
      setSubmigErrorMessage(data.message);
    }
  }, [data]);

  return (
    <PostWrapper className="px-2 pb-12 pt-32 md:px-8 md:pt-12" >
      <Form method={method}>
        <div className="h-full min-h-screen rounded bg-white p-8">
          <textarea
            name="content"
            className="hidden"
            value={markdown}
            onChange={() => {}}
          />
          <div onDragEnter={startDragHandler} className="relative">
            <MDEditor
              ref={editorRef}
              value={markdown}
              onChange={changeEditorHandler}
              commands={editHelper.editChoice(inputRef)}
              preview="edit"
              textareaProps={{
                placeholder: "Tell about your story...",
              }}
              previewOptions={{
                components: {
                  code: Code,
                },
              }}
              height={"100vh"}
            />
            {isDrag && (
              <div
                className="absolute bottom-0 left-0 right-0 top-0 h-full w-full"
                onDrop={dropHandler}
                onDragEnter={dragHandler}
                onDragOver={dragHandler}
                onDragLeave={dragHandler}
              ></div>
            )}
          </div>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept=".jpg,.png,.jpeg,.jfif,.gif"
            name="avatar"
            onChange={inputImageHandler}
          />
        </div>
        <div className="my-8 flex flex-col ">
          {!isTouched && submigErrorMessage && (
            <p className="px-1 pb-2 text-left font-pt-serif text-sm text-self-red">
              {submigErrorMessage}
            </p>
          )}
          <div className="flex justify-end font-pt-serif ">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className={
                "ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl " +
                "hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              }
              spinner={{ color: "text-blue-600" }}
            >
              Save
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={cancelHandler}
              className="ml-4 rounded-xl bg-blue-500 px-4 py-1.5 text-white shadow-xl hover:bg-blue-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </PostWrapper>
  );
}

export default AboutEditor;
