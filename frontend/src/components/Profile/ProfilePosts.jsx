import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useLoaderData } from "react-router-dom";

// components
import PostsList from "../Post/PostsList";
import { AwaitWrapper } from "../Wrapper/AwaitWrapper";

const limit = 10;
function ProfilePosts() {
  const [page, setPage] = useState(1);

  // react-router
  const { posts } = useLoaderData();

  // import hooks
  const matches = useMediaQuery({ query: "(min-width: 480px)" });

  // custom functions
  const navPageHandler = (nextPage) => setPage(nextPage);
  if (matches)
    return (
      <AwaitWrapper resolve={posts}>
        {(response) => {
          const inputPosts = response?.data
            ? response?.data.slice(
                (page - 1) * limit,
                limit + (page - 1) * limit - 1
              )
            : [];

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
        }}
      </AwaitWrapper>
    );
    
  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full rounded-xl border-2 border-gray-200 p-2">
        <AwaitWrapper resolve={posts}>
          {(response) => {
            const inputPosts = response?.data
              ? response?.data.slice(
                  (page - 1) * limit,
                  limit + (page - 1) * limit - 1
                )
              : [];

            return (
              <PostsList
                size="xs"
                posts={inputPosts}
                total={response.total}
                isShowAuthor={false}
                isShowDescription={false}
                isTagOnTopRight={true}
                onNavPage={navPageHandler}
                page={page}
                limit={limit}
              />
            );
          }}
        </AwaitWrapper>
      </div>
    </div>
  );
}

export default ProfilePosts;
