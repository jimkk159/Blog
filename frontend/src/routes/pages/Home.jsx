import { useMediaQuery } from "react-responsive";

// components
import HowTo from "../../components/Section/HowTo";
import Popular from "../../components/Section/Popular";
import MainBanner from "../../components/UI/MainBanner";
import Carousel from "../../components/Section/Carousel";
import RankingList from "../../components/Section/RankingList";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { posts } from "./data";

function Home() {
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <div className="h-full px-6 py-12">
      <div className="flex justify-center pt-24 md:pt-0">
        <div className="h-full w-full max-w-5xl rounded-3xl bg-self-dark-gray p-8">
          <MainBanner />
          <div className="my-16 w-full border-b border-self-gray" />
          <div className="flex flex-col items-center justify-center space-x-4 lg:flex-row lg:items-start">
            <Carousel posts={posts} />
            {!matches1024 && (
              <div className="my-16 w-full border-b border-self-gray" />
            )}
            <RankingList posts={posts} />
          </div>
          <div className="my-16 w-full border-b border-self-gray" />
          <HowTo />
          <div className="my-16 w-full border-b border-self-gray" />
          <Popular posts={posts} />
        </div>
      </div>
    </div>
  );
}

export default Home;
