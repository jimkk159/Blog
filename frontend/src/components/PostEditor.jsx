import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { useRef, useEffect, useState, useCallback } from "react";
import { Form, useNavigation, useRouteLoaderData } from "react-router-dom";

import * as editHelper from "../utils/edit";

//CSS
import classes from "./PostEditor.module.css";

function PostEditor({ method, post }) {
  const inputRef = useRef(null);
  const editorRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);

  const [markdown, setMarkdown] = useState("");

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { categories } = useRouteLoaderData("posts");

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

  const postContent = post?.content ? post.content : "";
  useEffect(() => setMarkdown(postContent), [postContent]);

  return (
    <>
      <Form method={method} >
        <select
          id="CategoryId"
          name="CategoryId"
          defaultValue={post ? post.CategoryId : null}
        >
          {categories &&
            categories.length &&
            categories
              .filter((el) => el.name !== "root")
              .map((el, index) => (
                <option key={index} value={el.id}>
                  {el.name}
                </option>
              ))}
        </select>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={post ? post.title : null}
        />
        <textarea
          name="content"
          style={{ display: "none" }}
          value={markdown}
          onChange={setMarkdown}
        />
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </Form>
      <div onDragEnter={startDragHandler} className={`${classes["related"]}`}>
        <MDEditor
          ref={editorRef}
          value={markdown}
          onChange={setMarkdown}
          commands={editHelper.editChoice(inputRef)}
          preview="edit"
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
        />
        {isDrag && (
          <div
            className={`${classes["upload-drag"]}`}
            onDrop={dropHandler}
            onDragEnter={dragHandler}
            onDragOver={dragHandler}
            onDragLeave={dragHandler}
          ></div>
        )}
      </div>
      <MDEditor.Markdown source={markdown} style={{ whiteSpace: "pre-wrap" }} />
      <input
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg,.jfif,.gif"
        name="avatar"
        onChange={inputImageHandler}
      />
    </>
  );
}

export default PostEditor;
