import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useRouteLoaderData } from "react-router-dom";

import PostsList from "../Post/PostsList";

const limit = 10;
function ProfilePosts() {
  const [page, setPage] = useState(1);

  // react-router
  const { posts } = useRouteLoaderData("profile");
  const inputPosts = posts.data
    ? posts.data.slice((page - 1) * limit, limit + (page - 1) * limit - 1)
    : [];

  // import hooks
  const matches = useMediaQuery({ query: "(min-width: 480px)" });

  // custom functions
  const navPageHandler = (nextPage) => setPage(nextPage);

  if (!matches)
    return (
      <div className="h-full w-full p-2">
        <div className="h-full w-full rounded-xl border-2 border-gray-200 p-2">
          <PostsList
            size="xs"
            posts={inputPosts}
            total={posts.total}
            isShowAuthor={false}
            isShowDescription={false}
            isTagOnTopRight={true}
            onNavPage={navPageHandler}
            page={page}
            limit={limit}
          />
        </div>
      </div>
    );
  return (
    <PostsList
      size="small"
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
