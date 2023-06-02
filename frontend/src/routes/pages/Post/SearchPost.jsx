import {
  defer,
  redirect,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import PostsList from "../../../components/Post/PostsList";
import PostsNavigation from "../../../components/Post/PostsNavigation";

const defaultPage = 1;
const defaultLimit = 15;

function Search() {
  const { posts } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get("mode") ?? "category";
  const type = searchParams.get("type") ?? "text";
  const target = searchParams.get("target") ?? "";
  const limit = searchParams.get("limit") ?? defaultLimit;

  const navPageHandler = (nextPage) =>
    setSearchParams({ mode, type, target, page: nextPage, limit });

  return (
    <div className="flex min-h-screen">
      <PostsNavigation />
      <PostsList
        posts={posts}
        total={posts.length}
        onNavPage={navPageHandler}
      />
    </div>
  );
}

export default Search;

async function postsLoader({ mode, type, target, page, limit }) {
  if (!(mode && type && target))
    return {
      total: 0,
      data: [],
    };

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/search?mode=${mode}&type=${type}&target=${target}` +
      `&page=${page ? page : defaultPage}&limit=${limit ? limit : defaultLimit}`
  );

  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode");
  const type = searchParams.get("type");
  const target = searchParams.get("target");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  return defer({
    posts: await postsLoader({ mode, type, target, page, limit }),
  });
}

export async function action({ request }) {
  const data = await request.formData();
  const mode = data.get("mode").toLowerCase();
  const target = data.get("target");
  const page = data.get("page");
  const limit = data.get("limit");

  return redirect(
    `/search?mode=${mode}&type=text&target=${target}` +
      `${page ? `&page=${page}` : ""}` +
      `${limit ? `&limit=${limit}` : ""}`
  );
}
