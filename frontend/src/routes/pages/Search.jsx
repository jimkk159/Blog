import PostsList from "./PostsList";
import Pagination from "../../components/UI/Pagination";
import {
  defer,
  redirect,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";

const defaultPage = 1;
const defaultLimit = 15;

function Search() {
  const { searchPostsRes } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get("mode") ?? "category";
  const type = searchParams.get("type") ?? "text";
  const target = searchParams.get("target") ?? "";
  const page = searchParams.get("page") ?? defaultPage;
  const limit = searchParams.get("limit") ?? defaultLimit;

  const navPageHandler = (nextPage) =>
    setSearchParams({ mode, type, target, page: nextPage, limit });

  return (
    <>
      <PostsList posts={searchPostsRes.data} />
      <Pagination
        total={searchPostsRes.total}
        current={page}
        limit={limit}
        onNavPage={navPageHandler}
      />
    </>
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
      `/api/v1/blog/posts/search?mode=${mode}&type=${type}&target=${target}` +
      `&page=${page ? page : defaultPage}&limit=${limit ? limit : defaultLimit}`
  );

  const resJSON = await response.json();
  return {
    total: resJSON.total,
    data: resJSON.data,
  };
}

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode");
  const type = searchParams.get("type");
  const target = searchParams.get("target");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  return defer({
    searchPostsRes: await postsLoader({ mode, type, target, page, limit }),
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
