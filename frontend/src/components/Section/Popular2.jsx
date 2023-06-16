import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";

// components
import SectionTitle from "./SectionTitle";
import PinkButton from "../UI/PinkButton";
import PopularItem from "../Items/PopularItem";
import PopularItem2 from "../Items/PopularItem2";

function PopularPost({ posts, slide, button }) {
  let popular = null;
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });
  
  // carousel setting
  const slidesToShow = matches1024 ? 4 : matches768 ? 3: 2;
  const carouselSetting = {
    autoplay: true,
    autoplaySpeed: 10000,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow,
  };

  if (matches768 && slide)
    popular = (
      <div className="my-8 w-full">
        <Slider {...carouselSetting}>
          {posts.map((post, index) => (
            <PopularItem2 key={index} post={post} />
          ))}
        </Slider>
      </div>
    );
  else
    popular = (
      <div className="my-8 flex flex-col items-center justify-center space-y-6">
        {posts.slice(0, 3).map((post, index) => (
          <PopularItem key={index} post={post} />
        ))}
      </div>
    );

  return (
    <div className="mb-16 flex h-full flex-col rounded-3xl bg-self-dark px-4 py-8 md:p-8">
      <div className="flex items-center justify-between">
        <SectionTitle first={"Most Popular"} second={"Posts this week"} />
      </div>
      {popular}
      {button && (
        <div className="pt-22">
          <PinkButton text={"Discover All Posts"} />
        </div>
      )}
    </div>
  );
}

export default PopularPost;
