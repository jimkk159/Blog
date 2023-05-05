import { defer, Outlet } from "react-router-dom";
import * as category from "../../util/category";
import PostNavigation from "../../components/PostsNavigation";

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

async function postsLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/posts"
  );

  const resJSON = await response.json();
  return resJSON.data;
}

async function tagsLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/tags"
  );

  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader() {
  return defer({
    categories: await categoryLoader(),
    posts: await postsLoader(),
    tags: await tagsLoader(),
  });
}
