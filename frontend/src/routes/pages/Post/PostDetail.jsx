import { useSelector } from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import {
  json,
  defer,
  useSubmit,
  redirect,
  useNavigate,
  useActionData,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";

// helper
import * as helper from "../../../utils/helper";
import * as authHelper from "../../../utils/auth";

// components
import { AwaitWrapper } from "../../helper/Wrapper";
import Button from "../../../components/UI/Button";
import TagList from "../../../components/Tag/TagList";
import Chapter from "../../../components/Post/Chapter";

function PostDetail() {
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // redux
  const auth = useSelector((state) => state.auth);
  const startDeleteHandler = () => {
    const proceed = window.confirm("Are you sure?");
    if (proceed) submit(null, { method: "delete" });
  };

  // react-router
  const data = useActionData;
  const submit = useSubmit();
  const navigate = useNavigate();
  const { post } = useRouteLoaderData("post-detail");

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // useEffect
  useEffect(() => {
    if (data && data.message) {
      setSubmigErrorMessage(data.message);
    }
  }, [data]);

  return (
    <AwaitWrapper resolve={post}>
      {(loadPost) => (
        <div className="flex min-h-screen w-full justify-center p-6 md:px-8 md:py-12">
          <div className="relative flex h-full w-full max-w-3xl flex-col justify-between rounded bg-white px-4 py-8 text-black md:px-8 md:pt-12">
            <div className="pb-4">
              <p
                className={`w-full resize-none overflow-y-hidden border-b-2 border-gray-300 pl-1 font-pt-serif text-3xl outline-none`}
              >
                {loadPost.title}
              </p>
            </div>
            <div className="h-full rounded border border-black p-2 md:p-4">
              <MDEditor.Markdown source={loadPost.content} />
            </div>
            <div className="pt-4">
              <TagList post={loadPost} />
              <div className="mt-2 flex flex-col">
                {submigErrorMessage && (
                  <p className="px-1 pb-2 text-left font-pt-serif text-sm text-self-red">
                    {submigErrorMessage}
                  </p>
                )}
                <div className="flex justify-end font-pt-serif ">
                  {helper.hasPermissionToPost({
                    auth,
                    AuthorId: loadPost.AuthorId,
                  }) && (
                    <button
                      type="submit"
                      className="ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                      onClick={() => navigate("edit")}
                    >
                      EDIT
                    </button>
                  )}
                  {helper.hasPermissionToPost({
                    auth,
                    AuthorId: loadPost.AuthorId,
                  }) && (
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      onClick={startDeleteHandler}
                      className="ml-4 rounded-xl bg-blue-500 px-4 py-1.5 text-white shadow-xl hover:bg-blue-600"
                    >
                      DELETE
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Chapter post={loadPost} />
        </div>
      )}
    </AwaitWrapper>
  );
}

export default PostDetail;

async function postLoader(id) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/${id}`
  );

  switch (response.status) {
    case 404:
      throw json({ message: "Could not fetch target post." }, { status: 404 });
    default:
      if (!response.ok)
        throw json({ message: "Unknown Error" }, { status: 500 });
  }

  const resJSON = await response.json();
  return resJSON.data;
}

export function loader({ params }) {
  const id = params.pid;
  return defer({
    post: postLoader(id),
  });
}

export async function action({ params, request }) {
  const postId = params.pid;
  const token = authHelper.getAuthToken();

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/${postId}`,
    {
      method: request.method,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok)
    return json(
      {
        message: `Something wrong happen when ${
          request.method === "DELETE" ? "deleting" : "creating"
        } post...`,
      },
      { status: 500 }
    );

  if (request.method === "DELETE") return redirect(`/`);
  return redirect(`/${postId}`);
}
