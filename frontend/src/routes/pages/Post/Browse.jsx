import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useRouteLoaderData, useSearchParams } from "react-router-dom";

// components
import Container from "../../../components/UI/Container";
import PostList2 from "../../../components/Post/PostsList2";
import Popular2 from "../../../components/Section/Popular2";
import RankingListSection2 from "../../../components/Section/RankingList2";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { posts } from "../data";

function Browse() {
  // react-routers
  // const { posts } = useRouteLoaderData("posts");
  // const { relation } = useRouteLoaderData("relation");
  // const [searchParams, setSearchParams] = useSearchParams();

  // import hooks
  // const matches768 = useMediaQuery({ query: "(max-width: 768px)" });
  const matches1280 = useMediaQuery({ query: "(max-width: 1280px)" });
  const matches1536 = useMediaQuery({ query: "(max-width: 1536px)" });

  // custom functions
  // const limit = searchParams.get("limit") ?? 15;
  // const navPageHandler = (nextPage) =>
  //   setSearchParams({ page: nextPage, limit });
  const limit = 15;
  const inputs = posts.slice(0, limit);
  const [page, setPage] = useState(1);
  const [inputPosts, setInputPosts] = useState(inputs);

  const navPageHandler = (nextPage) => {
    setInputPosts(posts.slice(0 + limit * (nextPage - 1), limit * nextPage));
    setPage(nextPage);
  };
  const RankingList = !matches1280 && (
    <div className="pl-2">
      <RankingListSection2 posts={posts} show={false} />
    </div>
  );
  return (
    <Container right={RankingList}>
      <div className="w-full rounded-3xl bg-self-dark-gray p-6">
        {matches1280 && (
          <>
            <Popular2 posts={posts} slide />
            <div className="my-8 w-full border-b border-self-gray" />
          </>
        )}
        <PostList2
          limit={15}
          size="small"
          page={page}
          posts={inputPosts}
          total={posts.length}
          onNavPage={navPageHandler}
        />
      </div>
    </Container>
  );
}

export default Browse;
