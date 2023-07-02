import { useSelector } from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect, useCallback } from "react";
import {
  useSubmit,
  useNavigate,
  useActionData,
  useNavigation,
} from "react-router-dom";

// icons
import { FiThumbsUp } from "react-icons/fi";
import { AiFillCheckCircle } from "react-icons/ai";

// helper
import * as helper from "../../utils/helper";
import * as authHelper from "../../utils/auth";

// components
import Avatar from "../UI/Avatar";
import Button from "../../components/UI/Button";
import TagList from "../../components/Tag/List";
import PostWrapper from "../../components/Wrapper/PostWrapper";

function Detail({ post }) {
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // react-router
  const data = useActionData();
  const submit = useSubmit();
  const navigate = useNavigate();

  // redux
  const auth = useSelector((state) => state.auth);
  const startDeleteHandler = () => {
    const proceed = window.confirm("Are you sure?");
    if (proceed) submit(null, { method: "delete" });
  };

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const top = (
    <>
      <h1
        className={`mb-4 mt-8 w-full px-4 font-poppins text-4xl font-bold text-white md:mt-4 md:px-0`}
      >
        {post.title}
      </h1>
      <div className="mb-4 flex items-end space-x-1 px-4 md:px-0">
        <div className="flex cursor-pointer justify-start hover:opacity-90">
          <Avatar
            avatar={post.Author.avatar}
            title={post.Author.name}
            className={"h-9 w-9 border-2 border-white md:h-12 md:w-12"}
            onClick={() => navigate(`/profile/${post.Author.id}`)}
          />
        </div>
        <div className="flex flex-col space-y-0.5 pl-1 md:space-y-0 md:pl-2">
          <div
            className="flex cursor-pointer items-center space-x-1 text-self-pink-500 hover:text-self-pink-600"
            onClick={() => navigate(`/profile/${post.Author.id}`)}
          >
            <AiFillCheckCircle className="h-3 w-3 md:h-4 md:w-4" />
            <p className="w-fit truncate text-xs md:text-base">
              {post.Author.name}
            </p>
          </div>
          <p className="overflow-ellipsis whitespace-nowrap text-xs italic text-gray-400 md:text-sm">
            {helper.formatDate(post.editedAt)}
          </p>
        </div>
      </div>
    </>
  );

  // custom functions
  const postId = post.id;
  const increaseThumbs = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const token = authHelper.getAuthToken();

      if (token) {
        await fetch(
          process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/${postId}/thumb`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        ).catch((err) => err);
        navigate(".");
      }
    },
    [postId, navigate]
  );

  const bottom = (
    <div className="mt-2 flex flex-col p-4 pt-0 md:p-0">
      {submigErrorMessage && (
        <p className="px-1 pb-2 text-left font-pt-serif text-sm text-self-red">
          {submigErrorMessage}
        </p>
      )}
      <div className="flex justify-between font-pt-serif">
        <div
          className="flex cursor-pointer items-center justify-end space-x-1 text-white md:space-x-1.5 md:pl-4 lg:space-x-1"
          onClick={increaseThumbs}
        >
          <FiThumbsUp className="mb-0.5 w-4 hover:text-gray-200 md:h-5 md:w-5" />
          <p className="text-right text-sm hover:text-gray-200 md:w-2 md:text-base lg:w-4 lg:text-lg">
            {post.thumbs}
          </p>
        </div>
        {helper.hasPermissionToPost({
          auth,
          AuthorId: post.AuthorId,
        }) && (
          <div>
            <button
              type="submit"
              className="ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={() => navigate("edit")}
            >
              EDIT
            </button>
            <Button
              type="button"
              disabled={isSubmitting}
              loading={isSubmitting}
              onClick={startDeleteHandler}
              className="ml-4 rounded-xl bg-blue-500 px-4 py-1.5 text-white shadow-xl hover:bg-blue-600"
            >
              DELETE
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // useEffect
  useEffect(() => {
    if (data && data.message) {
      setSubmigErrorMessage(data.message);
    }
  }, [data]);

  return (
    <PostWrapper top={top} bottom={bottom}>
      <div className="flex h-full min-h-screen flex-col justify-between rounded bg-white p-4 pt-8 md:p-8">
        <div className="h-full rounded">
          <MDEditor.Markdown source={post.content} />
        </div>
        <div className="mt-4">
          <TagList post={post} />
        </div>
      </div>
    </PostWrapper>
  );
}

export default Detail;
