import MDEditor from "@uiw/react-md-editor";
// import rehypeSanitize from "rehype-sanitize";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  Form,
  useNavigate,
  useActionData,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";

// components
import Code from "../Plugins";
import Button from "../UI/Button";
import TagList from "../Tag/TagList";
import * as editHelper from "../../utils/edit";
import PostWrapper from "../Wrapper/PostWrapper";
import EditPostModal from "../Modal/EditPostModal";
import { AwaitWrapper } from "../Wrapper/AwaitWrapper";

function PostEditor({ method, post }) {
  const inputRef = useRef(null);
  const titleRef = useRef(null);
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [isDrag, setIsDrag] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [category, setCategory] = useState(0);
  const [titleHeigh, setTitleHeigh] = useState(36);
  const [isTouched, setIsTouched] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // react-router
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { relation } = useRouteLoaderData("relation");

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

  const getCurrentCategory = (category, categories) => {
    if (categories && !!category) {
      const target = categories.filter((el) => el?.id === +category);
      if (target) return target[0]?.name;
    }
    return null;
  };

  // useEffect
  const postTitle = post?.title ? post.title : "";
  const postContent = post?.content ? post.content : "";
  useEffect(() => {
    setTitle(postTitle);
    setMarkdown(postContent);
  }, [postTitle, postContent]);

  useEffect(() => {
    if (data && data.message) {
      setIsTouched(false);
      setSubmigErrorMessage(data.message);
    }
  }, [data]);

  useEffect(() => {
    if (post && post.CategoryId) setCategory(post.CategoryId);
  }, [post]);

  return (
    <PostWrapper>
      <Form
        method={method}
        onClick={(e) => {
          e.stopPropagation();
          if (isDrop) setIsDrop(false);
        }}
        onBlur={() => setIsDrop(false)}
      >
        <AwaitWrapper resolve={relation}>
          {(response) => {
            const categories = response?.data?.categories?.data ?? [];
            return (
              <>
                <div className="h-full min-h-screen rounded bg-white p-4 pt-8 md:p-8">
                  <div className={`${submigErrorMessage ? "" : "pb-2"}`}>
                    <textarea
                      ref={titleRef}
                      id="title"
                      type="text"
                      name="title"
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
                  <input
                    ref={inputRef}
                    className="hidden"
                    type="file"
                    accept=".jpg,.png,.jpeg,.jfif,.gif"
                    name="avatar"
                    onChange={inputImageHandler}
                  />
                  <div className="mt-4">
                    <TagList post={post} isEdit={true} />
                  </div>
                </div>
                <div className="my-8 rounded px-4 md:mt-16 md:p-0">
                  <div className="flex flex-wrap items-center justify-start">
                    <p className="mr-4 text-base font-bold capitalize text-self-pink-500 md:mr-6 md:text-2xl">
                      <span className="text-white underline">Which topic</span>
                      {" does it belong to?"}
                    </p>
                    <div className="mt-2 w-40 md:w-60">
                      <select
                        id="CategoryId"
                        name="CategoryId"
                        className="h-8 w-full truncate rounded-sm border border-black p-1 font-pt-serif text-base outline-none"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="default" defaultValue>
                          Select an topic
                        </option>
                        {categories
                          .filter((el) => el.name !== "root")
                          .map((el, index) => (
                            <option key={index} value={el.id}>
                              {el.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col ">
                    {!isTouched && submigErrorMessage && (
                      <p className="px-1 pb-2 text-left font-pt-serif text-sm text-self-red">
                        {submigErrorMessage}
                      </p>
                    )}
                    <div className="flex justify-end font-pt-serif ">
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className={
                          "ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl " +
                          "hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                        }
                        spinner={{ color: "text-blue-600" }}
                        onClick={() => setIsShowModal(true)}
                      >
                        Next
                      </Button>
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        onClick={cancelHandler}
                        className="ml-4 rounded-xl bg-blue-500 px-4 py-1.5 text-white shadow-xl hover:bg-blue-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
                <EditPostModal
                  show={isShowModal}
                  onCancel={() => setIsShowModal(false)}
                  title={title}
                  topic={getCurrentCategory(category, categories)}
                />
              </>
            );
          }}
        </AwaitWrapper>
      </Form>
    </PostWrapper>
  );
}

export default PostEditor;
