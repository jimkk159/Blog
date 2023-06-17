import { useMediaQuery } from "react-responsive";
import { json, defer, useRouteLoaderData } from "react-router-dom";

// components
import { AwaitWrapper } from "../helper/Wrapper";
import HowTo from "../../components/Section/HowTo";
import Container from "../../components/UI/Container";
import Popular from "../../components/Section/Popular";
import MainBanner from "../../components/UI/MainBanner";
import Carousel from "../../components/Section/Carousel";
import RankingList from "../../components/Section/RankingList";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import { posts } from "./data";

function Home() {
  const { posts } = useRouteLoaderData("root");
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <AwaitWrapper resolve={posts}>
      {(loadPosts) => {
        const featuredPosts = loadPosts?.comments?.data ?? [];
        const topPosts = loadPosts?.thumbs?.data ?? [];
        const popularPosts = loadPosts?.views?.data ?? [];

        return (
          <Container>
            <div className="w-full rounded-3xl bg-self-dark-gray p-6">
              <MainBanner />
              <div className="my-16 w-full border-b border-self-gray" />
              <div className="flex flex-col items-center justify-center space-x-4 lg:flex-row lg:items-start">
                <Carousel posts={featuredPosts} />
                {!matches1024 && (
                  <div className="my-16 w-full border-b border-self-gray" />
                )}
                <RankingList posts={topPosts} />
              </div>
              <div className="my-16 w-full border-b border-self-gray" />
              <HowTo />
              <div className="my-16 w-full border-b border-self-gray" />
              <Popular posts={popularPosts} />
            </div>
          </Container>
        );
      }}
    </AwaitWrapper>
  );
}

export default Home;

async function PostsLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/home`
  );

  if (!response.ok)
    throw json({ message: "Could not fetch posts." }, { status: 404 });

  const resJSON = await response.json();

  if (!resJSON.data)
    throw json({ message: "Could not fetch posts." }, { status: 404 });

  return resJSON.data;
}

export function loader() {
  return defer({ posts: PostsLoader() });
}
