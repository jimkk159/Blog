import { defer, Outlet, json } from "react-router-dom";

function PostsRelationRoot() {
  return <Outlet />;
}

export default PostsRelationRoot;

async function categoryLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/categories"
  );

  if (!response.ok)
    throw json({ message: "Could not fetch categories." }, { status: 404 });

  const resJSON = await response.json();

  if (!(resJSON.data && resJSON.data.length))
    throw json({ message: "Could not fetch categories." }, { status: 404 });

  return resJSON.data;
}

async function postRelationLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/relation`
  );

  if (!response.ok)
    throw json({ message: "Could not fetch posts." }, { status: 404 });

  const resJSON = await response.json();

  if (!resJSON.data)
    throw json({ message: "Could not fetch posts." }, { status: 404 });

  return resJSON.data;
}

async function tagLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/tags"
  );

  if (!response.ok)
    throw json({ message: "Could not fetch tags." }, { status: 404 });

  const resJSON = await response.json();

  if (!resJSON.data)
    throw json({ message: "Could not fetch tags." }, { status: 404 });

  return resJSON.data;
}

export async function loader() {
  return defer({
    categories: await categoryLoader(),
    relation: await postRelationLoader(),
    tags: await tagLoader(),
  });
}
