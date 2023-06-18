import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { json, defer, useLoaderData, useSearchParams } from "react-router-dom";

// components
import { AwaitWrapper } from "../../helper/Wrapper";
import Container from "../../../components/UI/Container";
import PostList2 from "../../../components/Post/PostsList2";
import Popular2 from "../../../components/Section/Popular2";
import PostsNavigation2 from "../../../components/Post/PostsNavigation2";
import RankingListSection2 from "../../../components/Section/RankingList2";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Browse() {
  const [page, setPage] = useState(1);

  // react-routers
  const { posts, home } = useLoaderData();
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
      <AwaitWrapper resolve={home}>
        {(response) => {
          const topPosts = response?.data?.thumbs?.data ?? [];
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
          <AwaitWrapper resolve={home}>
            {(response) => {
              const popularPosts = response?.data?.views?.data ?? [];
              return (
                <>
                  <Popular2 posts={popularPosts} slide />
                  <div className="my-8 w-full border-b border-self-gray" />
                </>
              );
            }}
          </AwaitWrapper>
        )}
        <AwaitWrapper resolve={posts}>
          {(response) => (
            <PostList2
              limit={15}
              size="small"
              page={page}
              posts={response.data}
              total={response.total}
              onNavPage={navPageHandler}
            />
          )}
        </AwaitWrapper>
      </div>
    </Container>
  );
}

export default Browse;

async function homeLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/home`
  );

  if (!response.ok)
    throw json({ message: "Could not fetch posts." }, { status: 404 });

  return response.json();
}

async function postsLoader({ page, limit }) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts?page=${page}&limit=${limit}&fields=updatedAt`
  );

  if (!response.ok) throw new Error();

  return response.json();
}

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 15;

  return defer({
    home: homeLoader(),
    posts: postsLoader({ page, limit }),
  });
}
