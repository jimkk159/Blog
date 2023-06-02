import PostsList from "../../../components/Post/PostsList";
import { useSearchParams, useRouteLoaderData } from "react-router-dom";

function Posts() {
  const { posts } = useRouteLoaderData("posts");
  const { relation } = useRouteLoaderData("relation");
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = searchParams.get("limit") ?? 15;

  const navPageHandler = (nextPage) =>
    setSearchParams({ page: nextPage, limit });

  return (
    <div className="flex w-full items-center">
      <PostsList
        posts={posts}
        total={relation.length}
        onNavPage={navPageHandler}
      />
    </div>
  );
}

export default Posts;
