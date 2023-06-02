import { useRouteLoaderData } from "react-router-dom";
import PostsList from "../Post/PostsList";
import { useState } from "react";

const limit = 10;

function ProfilePosts() {
  const [page, setPage] = useState(1);
  const { posts } = useRouteLoaderData("profile");

  const inputPosts = posts.data
    ? posts.data.slice((page - 1) * limit, limit + (page - 1) * limit - 1)
    : [];
  const navPageHandler = (nextPage) => setPage(nextPage);

  return (
    <PostsList
      small={true}
      posts={inputPosts}
      total={posts.total}
      isShowAuthor={false}
      isShowDescription={false}
      isTagOnTopRight={true}
      onNavPage={navPageHandler}
      page={page}
      limit={limit}
    />
  );
}

export default ProfilePosts;
