import { defer, Outlet } from "react-router-dom";

function PostsRelationRoot() {
  return (
    <div className="flex flex-col">
      <Outlet />
    </div>
  );
}

export default PostsRelationRoot;

async function categoryLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/categories"
  );
  const resJSON = await response.json();
  return resJSON.data;
}

async function postRelationLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/posts/relation`
  );

  const resJSON = await response.json();
  return resJSON.data;
}

async function tagLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/tags"
  );

  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader() {
  return defer({
    categories: await categoryLoader(),
    relation: await postRelationLoader(),
    tags: await tagLoader(),
  });
}
