import PostsNavigation from "../../components/PostsNavigation";
import { defer, Outlet } from "react-router-dom";

function PostsRoot() {
  return (
    <div className="flex min-h-screen">
      <PostsNavigation />
      <Outlet />
    </div>
  );
}

export default PostsRoot;

async function postsLoader({ page, limit }) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/blog/posts?page=${page}&limit=${limit}&fields=updatedAt`
  );

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
