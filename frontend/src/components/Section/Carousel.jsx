import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";

// components
import SectionTitle from "./SectionTitle";
import CarouselItem from "./CarouselItem";

function CarouselSection({ posts }) {
  // import hooks
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });
  const matches980 = useMediaQuery({ query: "(min-width: 980px)" });
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });

  // carousel setting
  const slidesToShow = matches1024 ? 2 : matches980 ? 3 : matches768 ? 2 : 1;
  let carouselSetting = {
    autoplay: true,
    autoplaySpeed: 10000,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow,
  };
  if (!matches1024)
    carouselSetting = {
      ...carouselSetting,
      autoplaySpeed: 5000,
    };

  return (
    <div className="flex h-full w-full flex-col rounded-3xl bg-self-dark p-8 lg:w-[640px] lg:max-w-3xl">
      <div className="flex items-center justify-start px-6">
        <SectionTitle first={"Featured"} second={"Posts"} />
      </div>
      <Slider {...carouselSetting}>
        {posts.map((post, index) => (
          <CarouselItem key={index} post={post} />
        ))}
      </Slider>
    </div>
  );
}
export default CarouselSection;
