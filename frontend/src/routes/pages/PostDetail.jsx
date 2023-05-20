import MDEditor from "@uiw/react-md-editor";
import {
  defer,
  useRouteLoaderData,
  Link,
  useSubmit,
  redirect,
} from "react-router-dom";
import { AwaitWrapper } from "../helper/Wrapper";
import * as authHelper from "../../utils/auth";
import { useSelector } from "react-redux";

function PostDetail() {
  const submit = useSubmit();
  const token = useRouteLoaderData("root");
  const { post } = useRouteLoaderData("post-detail");
  const auth = useSelector((state) => state.auth);

  const startDeleteHandler = () => {
    const proceed = window.confirm("Are you sure?");
    if (proceed) {
      submit(null, { method: "delete" });
    }
  };

  return (
    <AwaitWrapper resolve={post}>
      {(loadPost) => (
        <>
          <h1>{loadPost.title}</h1>
          <MDEditor.Markdown source={loadPost.content} />
          {loadPost.Tags.map((tag, index) => (
            <p key={index}>{tag.name}</p>
          ))}
          {token && (auth.role === "root" || loadPost.AuthorId === auth.id) && (
            <Link to="edit">EDIT</Link>
          )}
          {token && (auth.role === "root" || loadPost.AuthorId === auth.id) && (
            <button onClick={startDeleteHandler}>DELETE</button>
          )}
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

  await fetch(process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/posts/${postId}`, {
    method: request.method,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (request.method === "DELETE") return redirect(`/`);
  return redirect(`/${postId}`);
}
