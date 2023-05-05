import {
  defer,
  useRouteLoaderData,
  Link,
  useSubmit,
  redirect,
} from "react-router-dom";
import { AwaitWrapper } from "../helper/Wrapper";
import * as authHelper from "../../util/auth";

function PostDetail() {
  const submit = useSubmit();
  const token = useRouteLoaderData("root");
  const { post } = useRouteLoaderData("post-detail");

  const startDeleteHandler = () => {
    const proceed = window.confirm("Are you sure?");
    if (proceed) {
      submit(null, { method: "delete" });
    }
  };
  return (
    <>
      <AwaitWrapper resolve={post}>
        {(loadPost) => (
          <>
            <h1>{loadPost.data.title}</h1>
            <p>{loadPost.data.content}</p>
          </>
        )}
      </AwaitWrapper>
      {token && <Link to="edit">EDIT</Link>}
      {token && <button onClick={startDeleteHandler}>DELETE</button>}
    </>
  );
}

export default PostDetail;

async function postLoader(id) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/posts/${id}`
  );
  return response.json();
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

  if (request.method === "DELETE") return redirect(`/posts`);
  return redirect(`/posts/${postId}`);
}
