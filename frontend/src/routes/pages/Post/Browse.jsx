import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useRouteLoaderData, useSearchParams } from "react-router-dom";

// components
import Container from "../../../components/UI/Container";
import PostList2 from "../../../components/Post/PostsList2";
import Popular2 from "../../../components/Section/Popular2";
import PostsNavigation2 from "../../../components/Post/PostsNavigation2";
import RankingListSection2 from "../../../components/Section/RankingList2";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AwaitWrapper } from "../../helper/Wrapper";

function Browse() {
  const [page, setPage] = useState(1);

  // react-routers
  const { posts } = useRouteLoaderData("posts");
  const { posts: rankPosts } = useRouteLoaderData("root");
  const [searchParams, setSearchParams] = useSearchParams();

  // import hooks
  const matches1280 = useMediaQuery({ query: "(max-width: 1280px)" });

  // custom functions
  const limit = searchParams.get("limit") ?? 15;
  const navPageHandler = (nextPage) => {
    setSearchParams({ page: nextPage, limit });
    setPage(nextPage);
  };

  const right = !matches1280 && (
    <div className="pl-2">
      <AwaitWrapper resolve={rankPosts}>
        {(loadPosts) => {
          const topPosts = loadPosts?.thumbs?.data ?? [];
          return <RankingListSection2 posts={topPosts} show={false} />;
        }}
      </AwaitWrapper>
    </div>
  );

  const left = !matches1280 && (
    <div className="flex w-full justify-end pr-2">
      <PostsNavigation2 limit />
    </div>
  );

  return (
    <Container left={left} right={right}>
      <div className="w-full rounded-3xl bg-self-dark-gray p-6">
        {matches1280 && (
          <AwaitWrapper resolve={rankPosts}>
            {(loadPosts) => {
              const popularPosts = loadPosts?.views?.data ?? [];
              return (
                <>
                  <Popular2 posts={popularPosts} slide />
                  <div className="my-8 w-full border-b border-self-gray" />
                </>
              );
            }}
          </AwaitWrapper>
        )}
        <PostList2
          limit={15}
          size="small"
          page={page}
          posts={posts}
          total={posts.total}
          onNavPage={navPageHandler}
        />
      </div>
    </Container>
  );
}

export default Browse;
