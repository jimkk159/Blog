import MDEditor from "@uiw/react-md-editor";
// import rehypeSanitize from "rehype-sanitize";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  useNavigate,
  useActionData,
  useRouteLoaderData,
} from "react-router-dom";

// components
import Code from "./Plugins";
import TagList from "../../Tag/List";
import PostEditorBottom from "./PostBottom";
import EditPostModal from "../Modal/EditPost";
import * as editHelper from "../../../utils/edit";
import PostWrapper from "../../Wrapper/PostWrapper";
import SelectCategory from "../../Post/SelectCategory";

function PostEditor({ method, post }) {
  const inputRef = useRef(null);
  const titleRef = useRef(null);
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [isDrag, setIsDrag] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [summary, setSummary] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [titleHeigh, setTitleHeigh] = useState(36);
  const [isEditTag, setIsEditTag] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // react-router
  const data = useActionData();
  const navigate = useNavigate();
  const { relation } = useRouteLoaderData("relation");

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

  const titleChangeHandler = (e) => {
    setTitle(e.target.value);
    setTitleHeigh(36 * (parseInt((+e.target.scrollHeight - 38) / 36) + 1));
  };

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
  const postTitle = post?.title ? post.title : "";
  const postContent = post?.content ? post.content : "";
  const postSummary = post?.summary ? post.summary : "";
  const postCategoryId = post?.CategoryId ? post.CategoryId : "";
  const postPreviewImg = post?.previewImg ? post.previewImg : "";
  useEffect(() => {
    setTitle(postTitle);
    setMarkdown(postContent);
    setSummary(postSummary);
    setCategoryId(postCategoryId);
    setPreviewImg(postPreviewImg);
  }, [postTitle, postContent, postSummary, postCategoryId, postPreviewImg]);

  useEffect(() => {
    if (data && data.message) {
      setIsTouched(false);
      setIsShowModal(false);
      setSubmigErrorMessage(data.message);
    }
  }, [data]);

  const selectCategory = (
    <SelectCategory
      className="h-8 w-full p-1 font-pt-serif text-base"
      relation={relation}
      value={categoryId}
      onChange={setCategoryId}
    />
  );

  const selectCategory2 = (
    <SelectCategory
      id="category"
      name="CategoryId"
      className="max-w-32 h-6 font-pt-serif text-sm"
      relation={relation}
      value={categoryId}
      onChange={setCategoryId}
    />
  );

  const bottom = (
    <PostEditorBottom
      isTouched={isTouched}
      submigErrorMessage={submigErrorMessage}
      onCancel={cancelHandler}
      onNext={() => setIsShowModal(true)}
    >
      {selectCategory}
    </PostEditorBottom>
  );

  return (
    <PostWrapper
      bottom={bottom}
      onClick={(e) => {
        if (isDrop) setIsDrop(false);
        if (isEditTag) setIsEditTag(false);
      }}
      className=""
    >
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept=".jpg,.png,.jpeg,.jfif,.gif"
        name="avatar"
        onChange={inputImageHandler}
      />
      <div className="h-full min-h-screen rounded bg-white p-4 pt-8 md:p-8">
        <div className={`${submigErrorMessage ? "" : "pb-2"}`}>
          <textarea
            ref={titleRef}
            required
            className={
              `h-[${titleHeigh}px] ` +
              `w-full resize-none overflow-y-hidden border-b-2 border-gray-300 pl-1 font-pt-serif text-3xl outline-none `
            }
            placeholder="Untitle"
            value={title}
            onChange={titleChangeHandler}
          />
          <textarea
            name="content"
            className="hidden"
            value={markdown}
            onChange={() => {}}
          />
        </div>
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
              // This will make the components lose efficacy
              // rehypePlugins: [[rehypeSanitize]],
              components: {
                code: Code,
              },
            }}
            height={700}
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
        <div className="mt-4">
          <TagList
            post={post}
            isEditMode={true}
            isEditting={isEditTag}
            onClose={() => setIsEditTag(false)}
            onToggle={() => setIsEditTag((prev) => !prev)}
          />
        </div>
      </div>
      <EditPostModal
        method={method}
        show={isShowModal}
        onCancel={() => setIsShowModal(false)}
        title={title}
        onTitle={titleChangeHandler}
        summary={summary}
        onSmmary={setSummary}
        previewImg={previewImg}
        onPreviewImg={setPreviewImg}
        content={markdown}
        selectCategory={selectCategory2}
        onSave={() => setIsShowModal(true)}
      />
    </PostWrapper>
  );
}

export default PostEditor;
