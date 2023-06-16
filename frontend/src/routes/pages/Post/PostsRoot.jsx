import { defer, Outlet } from "react-router-dom";

function PostsRoot() {
  return <Outlet />;
}

export default PostsRoot;

async function postsLoader({ page, limit }) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts?page=${page}&limit=${limit}&fields=updatedAt`
  );

  if (!response.ok) throw new Error();

  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 15;

  return defer({
    posts: await postsLoader({ page, limit }),
  });
}
