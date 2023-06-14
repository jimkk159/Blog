import { useMediaQuery } from "react-responsive";

// icon
import { AiFillCheckCircle } from "react-icons/ai";

import Service1 from "../../assets/imgs/service-01.jpg";
import Service2 from "../../assets/imgs/service-02.jpg";
import Service3 from "../../assets/imgs/service-03.jpg";

// components
import Carousel from "../../components/Home/Carousel";
import PinkButton from "../../components/Home/PinkButton";
import SectionTitle from "../../components/Home/SectionTitle";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TopPostItem from "../../components/Home/TopPostItem";
import RankingList from "../../components/Home/RankingList";

function Home() {
  // import hooks
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });

  const posts = [
    {
      previewImg:
        "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    },
    {
      previewImg:
        "https://images.unsplash.com/photo-1607796884038-3638822d5ee2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    },
    {
      previewImg:
        "https://images.unsplash.com/photo-1672872476232-da16b45c9001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    },
    {
      previewImg:
        "https://images.unsplash.com/photo-1590506357340-4f2d8f5da5cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
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
        <div className="h-full bg-self-dark px-3 pt-24">
          <div className="py-6">
            <div className="h-full w-full rounded-3xl bg-self-dark-gray p-8">
              <div className="flex justify-center space-x-4 flex-col items-center lg:flex-row lg:items-start">
                <Carousel posts={posts} />
                <RankingList posts={posts2} />
              </div>
              <div className="flex w-full items-center justify-between whitespace-nowrap pb-10 pt-24">
                <SectionTitle
                  first={"How To Start Your"}
                  second={"Live Stream"}
                />
              </div>
              <ul className="space-y-8">
                <li className="rounded-3xl border border-self-gray p-8">
                  <div>
                    <img src={Service1} className="rounded-full" />
                  </div>
                  <div>
                    <h1 className="mt-5 text-xl font-bold text-white">
                      Go To Your Profile
                    </h1>
                  </div>
                  <div>
                    <p className="mt-3 text-[14px] leading-loose">
                      Cyborg Gaming is free HTML CSS website template provided
                      by TemplateMo. This is Bootstrap v5.20 layout
                    </p>
                  </div>
                </li>
                <li className="rounded-3xl border border-self-gray p-8">
                  <div>
                    <img src={Service2} className="rounded-full" />
                  </div>
                  <div>
                    <h1 className="mt-5 text-xl font-bold text-white">
                      Live Stream Button
                    </h1>
                  </div>
                  <div>
                    <p className="mt-3 text-[14px] leading-loose">
                      If you wish to support us, you can make a small
                      contribution via PayPal to info [at] templatemo.com
                    </p>
                  </div>
                </li>
                <li className="rounded-3xl border border-self-gray p-8">
                  <div>
                    <img src={Service3} className="rounded-full" />
                  </div>
                  <div>
                    <h1 className="mt-5 text-xl font-bold text-white">
                      You Are Live
                    </h1>
                  </div>
                  <div>
                    <p className="mt-3 text-[14px] leading-loose">
                      You are not allowed to redistribute this template's
                      downloadable ZIP file on any other template collection
                      website.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="p-16">
                <PinkButton text={"Go To Profile"} />
              </div>
              <div className="mb-16 flex h-full flex-col rounded-3xl bg-self-dark p-8">
                <div className="flex items-center justify-between">
                  <SectionTitle first={"Most Popular"} second={"Live Stream"} />
                </div>
                <div className="my-8 flex w-full flex-col space-y-4 rounded-3xl border-2 border-zinc-600 bg-zinc-800 p-4 text-white">
                  <div className="flex w-full items-center justify-center">
                    <img
                      className="h-60 w-60 rounded-3xl object-cover"
                      src="https://images.unsplash.com/photo-1574758519652-904df1f8df4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fFZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                    />
                  </div>
                  <div className="flex h-full justify-between space-x-4">
                    <div className="flex h-full justify-start">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <img
                          className="h-10 w-10 overflow-hidden rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1610041321420-a596dd14ebc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <p className="flex items-center space-x-1 text-sm text-self-pink-500 ">
                        <AiFillCheckCircle className="h-4 w-4" />
                        <p>KenganC</p>
                      </p>
                      <div className="text-xl font-bold capitalize ">
                        Just talking with fans
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-8 flex w-full flex-col space-y-4 rounded-3xl border-2 border-zinc-600 bg-zinc-800 p-4 text-white">
                  <div className="flex w-full items-center justify-center">
                    <img
                      className="h-60 w-60 rounded-3xl object-cover"
                      src="https://images.unsplash.com/photo-1574758519652-904df1f8df4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fFZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                    />
                  </div>
                  <div className="flex h-full justify-between space-x-4">
                    <div className="flex h-full justify-start">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <img
                          className="h-10 w-10 overflow-hidden rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1610041321420-a596dd14ebc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <p className="flex items-center space-x-1 text-sm text-self-pink-500 ">
                        <AiFillCheckCircle className="h-4 w-4" />
                        <p>KenganC</p>
                      </p>
                      <div className="text-xl font-bold capitalize ">
                        Just talking with fans
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-8 flex w-full flex-col space-y-4 rounded-3xl border-2 border-zinc-600 bg-zinc-800 p-4 text-white">
                  <div className="flex w-full items-center justify-center">
                    <img
                      className="h-60 w-60 rounded-3xl object-cover"
                      src="https://images.unsplash.com/photo-1574758519652-904df1f8df4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fFZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                    />
                  </div>
                  <div className="flex h-full justify-between space-x-4">
                    <div className="flex h-full justify-start">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <img
                          className="h-10 w-10 overflow-hidden rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1610041321420-a596dd14ebc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <p className="flex items-center space-x-1 text-sm text-self-pink-500 ">
                        <AiFillCheckCircle className="h-4 w-4" />
                        <p>KenganC</p>
                      </p>
                      <div className="text-xl font-bold capitalize ">
                        Just talking with fans
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-8 flex w-full flex-col space-y-4 rounded-3xl border-2 border-zinc-600 bg-zinc-800 p-4 text-white">
                  <div className="flex w-full items-center justify-center">
                    <img
                      className="h-60 w-60 rounded-3xl object-cover"
                      src="https://images.unsplash.com/photo-1574758519652-904df1f8df4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fFZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                    />
                  </div>
                  <div className="flex h-full justify-between space-x-4">
                    <div className="flex h-full justify-start">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <img
                          className="h-10 w-10 overflow-hidden rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1610041321420-a596dd14ebc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <p className="flex items-center space-x-1 text-sm text-self-pink-500 ">
                        <AiFillCheckCircle className="h-4 w-4" />
                        <p>KenganC</p>
                      </p>
                      <div className="text-xl font-bold capitalize ">
                        Just talking with fans
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-22">
                  <PinkButton text={"Discover All Streams"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
