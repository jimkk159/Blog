import PostNavigation from "../../components/PostsNavigation";
import { defer, Outlet } from "react-router-dom";

function PostRoot() {
  return (
    <>
      <PostNavigation />
      <Outlet />
    </>
  );
}

export default PostRoot;

async function categoryLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/categories"
  );
  const resJSON = await response.json();
  return resJSON.data;
}

async function postsLoader({ page, limit }) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/blog/posts?page=${page}&limit=${limit}`
  );

  const resJSON = await response.json();
  return {
    total: resJSON.total,
    data: resJSON.data,
  };
}

async function tagsLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/tags"
  );

  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 15;

  return defer({
    categories: await categoryLoader(),
    postsRes: await postsLoader({ page, limit }),
    tags: await tagsLoader(),
  });
}
