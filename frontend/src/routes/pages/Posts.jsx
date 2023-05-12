import PostsList from "./PostsList";
import { useRouteLoaderData } from "react-router-dom";

function Posts() {
  const { posts } = useRouteLoaderData("posts");

  return <PostsList posts={posts} />;
}

export default Posts;
