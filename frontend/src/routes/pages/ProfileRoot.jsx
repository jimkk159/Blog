import PostsList from "./PostsList";
import * as authHelper from "../../util/auth";
import { defer, Outlet, useLoaderData } from "react-router-dom";

function ProfileRoot() {
  const { posts } = useLoaderData();

  return (
    <>
      <h1>Profile</h1>
      <Outlet />
      <PostsList posts={posts} />
    </>
  );
}

export default ProfileRoot;

async function selfAuthorLoader() {
  const token = authHelper.getAuthToken();

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/users/me`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  
  const resJSON = await response.json();
  return resJSON.data;
}

async function selfpostsLoader() {
  const token = authHelper.getAuthToken();

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/posts/me`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const resJSON = await response.json();
  return resJSON.data;
}

async function authorLoader(uid) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/users/${uid}`
  );

  const resJSON = await response.json();
  return resJSON.data;
}

async function postsLoader(uid) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/blog/posts/search?mode=author&type=id&target=${uid}`
  );

  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader({ params }) {
  if (!params.id)
    return defer({
      author: await selfAuthorLoader(),
      posts: await selfpostsLoader(),
    });

  return defer({
    author: await authorLoader(params.id),
    posts: await postsLoader(params.id),
  });
}
