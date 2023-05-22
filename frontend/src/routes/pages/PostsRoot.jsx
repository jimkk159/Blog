import PostsNavigation from "../../components/PostsNavigation";
import {
  defer,
  Outlet,
  useSearchParams,
  useRouteLoaderData,
} from "react-router-dom";
import Pagination from "../../components/UI/Pagination";

function PostsRoot() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? 1;
  const limit = searchParams.get("limit") ?? 15;
  const { relation } = useRouteLoaderData("relation");

  const navPageHandler = (nextPage) =>
    setSearchParams({ page: nextPage, limit });

  return (
    <>
      <div className="flex h-screen">
        <PostsNavigation />
        <Outlet />
      </div>
      <Pagination
        total={relation.length}
        current={page}
        limit={limit}
        onNavPage={navPageHandler}
      />
    </>
  );
}

export default PostsRoot;

async function postsLoader({ page, limit }) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/blog/posts?page=${page}&limit=${limit}`
  );

  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 15;

  return defer({
    posts: await postsLoader({ page, limit }),
  });
}
