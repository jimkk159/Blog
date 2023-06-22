import { defer, Outlet, json } from "react-router-dom";

function PostsRelationRoot() {
  return <Outlet />;
}

export default PostsRelationRoot;

async function relationLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/relation"
  );

  if (!response.ok)
    throw json({ message: "Could not fetch categories." }, { status: 404 });

  return response.json();
}

export async function loader() {
  return defer({
    relation: relationLoader(),
  });
}
