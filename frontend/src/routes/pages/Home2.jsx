import { useMediaQuery } from "react-responsive";

// components
import HowToSection from "../../components/Browse/HowToSection";
import PopularPostSection from "../../components/Browse/PopularPost";
import CarouselSection from "../../components/Browse/CarouselSection";
import RankingListSection from "../../components/Browse/RankingListSection";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });

  const posts = [
    {
      title:
        "Unlocking the Secrets of Time Travel: A Journey Through the Unknown",
      category: "Science",
      Author: {
        name: "Olivia Jenkins",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      },
      previewImg:
        "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    },
    {
      title:
        "Exploring the Mysteries of the Deep Sea: Unveiling the Hidden Wonders",
      category: "Financial",
      Author: {
        name: "Ava Martinez",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
      },
      previewImg:
        "https://images.unsplash.com/photo-1607796884038-3638822d5ee2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    },
    {
      title:
        "Mastering the Art of Mindfulness: Finding Inner Peace in a Hectic World",
      category: "Sport",

      Author: {
        name: "Lucas Ramirez",
        avatar:
          "https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      },
      previewImg:
        "https://images.unsplash.com/photo-1590506357340-4f2d8f5da5cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    },
    {
      title:
        "The Future of Artificial Intelligence: Advancements and Ethical Implications",
      category: "Music",
      Author: {
        name: "Mason Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
      },
      previewImg:
        "https://images.unsplash.com/photo-1672872476232-da16b45c9001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    },
  ];

  const posts2 = [
    {
      title: "Lofi Girl1",
      category: "Science",
      thumbs: 8,
      comments: 2,
      previewImg:
        "https://i.ytimg.com/vi/9MhHJaFsnuc/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDkgLih_MA8=&rs=AOn4CLB1Q8rOm8mqkhIa1jwR8FBCxckvXw",
    },
    {
      title: "Lofi Girl2",
      category: "Science",
      thumbs: 6,
      comments: 4,
      previewImg: "https://i.ytimg.com/vi/8r4bqa9mHWg/maxresdefault.jpg",
    },
    {
      title: "Lofi Girl3",
      category: "Science",
      thumbs: 8,
      comments: 2,
      previewImg: "https://i.ytimg.com/vi/2TvhRJweMuo/maxresdefault.jpg",
    },
    {
      title: "Lofi Girl4",
      category: "Science",
      thumbs: 6,
      comments: 4,
      previewImg: "https://i.ytimg.com/vi/-cswlH1laHc/maxresdefault.jpg",
    },
    {
      title: "Lofi Girl5",
      category: "Science",
      thumbs: 8,
      comments: 2,
      previewImg:
        "https://i.ytimg.com/vi/8BAl6z0lXdw/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGBIgYyhyMA8=&rs=AOn4CLBD1P_dhEIHLAVyschlBQstn9uk4Q",
    },
    {
      title: "Lofi Girl6",
      category: "Science",
      thumbs: 6,
      comments: 4,
      previewImg: "https://i.ytimg.com/vi/F6Dew1zwff0/maxresdefault.jpg",
    },
  ];
  
  return (
    <>
      <div className="rounded">
        <div className="h-full  px-6 py-12">
          <div className="flex justify-center">
            <div className="h-full w-full max-w-5xl rounded-3xl bg-self-dark-gray p-6">
              <div className="flex flex-col items-center justify-center space-x-4 lg:flex-row lg:items-start">
                <CarouselSection posts={posts} />
                {!matches1024 && (
                  <div className="my-16 w-full border-b border-self-gray" />
                )}
                <RankingListSection posts={posts2} />
              </div>
              <div className="my-16 w-full border-b border-self-gray" />
              <HowToSection />
              <div className="my-16 w-full border-b border-self-gray" />
              <PopularPostSection posts={posts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
