import PostsList from "./PostsList";
import { useRouteLoaderData, useSearchParams } from "react-router-dom";
import Pagination from "../../components/UI/Pagination";

function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? 1;
  const limit = searchParams.get("limit") ?? 15;

  const { postsRes } = useRouteLoaderData("posts");

  const navPageHandler = (nextPage) =>
    setSearchParams({ page: nextPage, limit });

  return (
    <>
      <PostsList posts={postsRes.data} />{" "}
      <Pagination
        total={postsRes.total}
        current={page}
        limit={limit}
        onNavPage={navPageHandler}
      />
    </>
  );
}

export default Posts;
