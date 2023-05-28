import MDEditor from "@uiw/react-md-editor";
import {
  defer,
  useSubmit,
  redirect,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { AwaitWrapper } from "../helper/Wrapper";
import * as authHelper from "../../utils/auth";
import * as helper from "../../utils/helper";
import { useSelector } from "react-redux";
import TagList from "../../components/TagList";
import Chapter from "../../components/Chapter";

function PostDetail() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const { post } = useRouteLoaderData("post-detail");
  const auth = useSelector((state) => state.auth);

  const startDeleteHandler = () => {
    const proceed = window.confirm("Are you sure?");
    if (proceed) submit(null, { method: "delete" });
  };
  const isSubmitting = false;
  return (
    <AwaitWrapper resolve={post}>
      {(loadPost) => (
        <>
          <div className="flex min-h-[100%] w-full justify-center px-8 py-12 ">
            <div className="relative h-full w-full max-w-3xl rounded bg-white p-16 text-black">
              <div className="pb-2">
                <p
                  className={`w-full resize-none overflow-y-hidden border-b-2 border-gray-300 pl-1 font-pt-serif text-3xl outline-none `}
                >
                  {loadPost.title}
                </p>
              </div>
              <MDEditor.Markdown source={loadPost.content} />
              <div className="my-8 flex justify-end font-pt-serif ">
                {helper.hasPermissionToPost({
                  auth,
                  AuthorId: loadPost.AuthorId,
                }) && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={() => navigate("edit")}
                  >
                    {isSubmitting ? "Submitting..." : "EDIT"}
                  </button>
                )}
                {helper.hasPermissionToPost({
                  auth,
                  AuthorId: loadPost.AuthorId,
                }) && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={startDeleteHandler}
                    className="ml-4 rounded-xl bg-blue-500 px-4 py-1.5 text-white shadow-xl hover:bg-blue-600"
                  >
                    DELETE
                  </button>
                )}
              </div>
              <div className="absolute bottom-8 left-16">
                <TagList post={loadPost} />
              </div>
            </div>
            <Chapter post={loadPost} />
          </div>
        </>
      )}
    </AwaitWrapper>
  );
}

export default PostDetail;

async function postLoader(id) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/posts/${id}`
  );
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

  await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/posts/${postId}`,
    {
      method: request.method,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (request.method === "DELETE") return redirect(`/`);
  return redirect(`/${postId}`);
}
