import { useRouteLoaderData } from "react-router-dom";
import PostsList from "../Post/PostsList";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const limit = 10;

function ProfilePosts() {
  const [page, setPage] = useState(1);
  const { posts } = useRouteLoaderData("profile");
  const matches = useMediaQuery({ query: "(min-width: 480px)" });

  const inputPosts = posts.data
    ? posts.data.slice((page - 1) * limit, limit + (page - 1) * limit - 1)
    : [];
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
