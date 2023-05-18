import PostsList from "./PostsList";
import { defer, redirect, useLoaderData } from "react-router-dom";

function Search() {
  const { searchPosts } = useLoaderData();

  return <PostsList posts={searchPosts} />;
}

export default Search;

async function postsLoader(mode, type, target) {
  if (!(mode && type && target)) return [];

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/blog/posts/search?mode=${mode}&type=${type}&target=${target}`
  );
  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode");
  const type = searchParams.get("type");
  const target = searchParams.get("target");

  return defer({
    searchPosts: await postsLoader(mode, type, target),
  });
}

export async function action({ request }) {
  const data = await request.formData();
  const mode = data.get("mode").toLowerCase();
  const target = data.get("target");

  return redirect(`/search?mode=${mode}&type=text&target=${target}`);
}
