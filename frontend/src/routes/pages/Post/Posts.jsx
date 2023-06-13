import { useMediaQuery } from "react-responsive";
import { useSearchParams, useRouteLoaderData } from "react-router-dom";

import PostsList from "../../../components/Post/PostsList";

function Posts() {
  // react-routers
  const { posts } = useRouteLoaderData("posts");
  const { relation } = useRouteLoaderData("relation");
  const [searchParams, setSearchParams] = useSearchParams();
  
  // import hooks
  const matches = useMediaQuery({ query: '(max-width: 768px)' });

  // custom functions
  const limit = searchParams.get("limit") ?? 15;
  const navPageHandler = (nextPage) =>
    setSearchParams({ page: nextPage, limit });

  return (
    <div className="flex w-full items-center">
      <PostsList
        posts={posts}
        total={relation.length}
        onNavPage={navPageHandler}
        isTagOnTopRight={matches}
      />
    </div>
  );
}

export default Posts;
