import PostsList from "./PostsList";
import { useRouteLoaderData } from "react-router-dom";

function Posts() {
  const { postsRes } = useRouteLoaderData("posts");

  return <PostsList posts={postsRes.data} />;
}

export default Posts;
