import PostsList from "../../components/PostsList";
import { useSearchParams, useRouteLoaderData } from "react-router-dom";

function Posts() {
  const { posts } = useRouteLoaderData("posts");
  const { relation } = useRouteLoaderData("relation");
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = searchParams.get("limit") ?? 15;

  const navPageHandler = (nextPage) =>
    setSearchParams({ page: nextPage, limit });

  return (
    <PostsList
      posts={posts}
      total={relation.length}
      onNavPage={navPageHandler}
    />
  );
}

export default Posts;
