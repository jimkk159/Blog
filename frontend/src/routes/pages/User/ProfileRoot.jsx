import * as authHelper from "../../../utils/auth";
import { defer, Outlet, redirect } from "react-router-dom";

function ProfileRoot() {
  return <Outlet />;
}

export default ProfileRoot;

async function selfAuthorLoader() {
  const token = authHelper.getAuthToken();

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/users/me`,
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
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/me?fields=updatedAt,-content,-AuthorId&all=1`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const resJSON = await response.json();
  return {
    data: resJSON.data,
    total: resJSON.total,
  };
}

async function authorLoader(uid) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/users/${uid}`
  );

  const resJSON = await response.json();
  return resJSON.data;
}

async function postsLoader(uid) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/search?mode=author&type=id&target=${uid}&fields=updatedAt`
  );
  const resJSON = await response.json();
  return {
    data: resJSON.data,
    total: resJSON.total,
  };
}

export async function loader({ params }) {
  const token = authHelper.getAuthToken();
  if (!token) return redirect("/");
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
