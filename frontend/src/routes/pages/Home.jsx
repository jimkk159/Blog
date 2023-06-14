import Slider from "react-slick";

// icon
import { FiThumbsUp } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";

import Service1 from "../../assets/imgs/service-01.jpg";
import Service2 from "../../assets/imgs/service-02.jpg";
import Service3 from "../../assets/imgs/service-03.jpg";

// components
import CarouselItem from "../../components/UI/CarouselItem";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const setting = {
    autoplay: true,
    autoplaySpeed: 10000,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };
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
  return (
    <>
      <div className="rounded">
        <div className="h-full bg-self-dark px-3 pt-24">
          <div className="py-6">
            <div className="h-full w-full rounded-3xl bg-self-dark-gray p-8">
              <div className="mb-16 flex h-full flex-col rounded-3xl bg-self-dark p-8">
                <div className="flex items-center justify-between px-6">
                  <h2 className="text-xl font-bold text-self-pink md:text-2xl">
                    <span className="text-white underline">Featured</span> Posts
                  </h2>
                </div>
                <Slider {...setting}>
                  {posts.map((post, index) => (
                    <CarouselItem key={index} post={post} />
                  ))}
                </Slider>
              </div>
              <div className="flex h-full flex-col rounded-3xl bg-self-dark p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-self-pink">
                    <span className="text-white underline">Top</span> Posts
                  </h2>
                </div>
                <ul className="border-b border-self-gray">
                  <li className="border-b border-self-gray">
                    <div className="my-8 flex h-full w-full flex-col space-y-6 text-white">
                      <div className="flex h-20 min-h-[80px] items-stretch justify-between space-x-2">
                        <div className="flex w-32 items-center justify-center">
                          <img
                            className="h-full w-full overflow-hidden rounded-3xl object-cover"
                            src="https://i.ytimg.com/vi/9MhHJaFsnuc/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDkgLih_MA8=&rs=AOn4CLB1Q8rOm8mqkhIa1jwR8FBCxckvXw"
                          />
                        </div>
                        <div className="flex h-full w-full flex-col justify-between">
                          <div>
                            <div className="flex items-end justify-between space-x-1">
                              <h1 className="text-xl font-bold">Lofi Girl</h1>
                            </div>
                            <p className="text-sm text-self-gray">Sandbox</p>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <div className="flex items-center justify-end space-x-1">
                              <FiThumbsUp className="mb-0.5 w-4" />
                              <p className="text-right text-sm">4.8</p>
                            </div>
                            <div className="flex items-center justify-end space-x-1">
                              <FaRegCommentDots className="mb-1 w-4 text-white" />
                              <p className="text-right text-sm">2.3M</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="my-8 flex h-full w-full flex-col space-y-6 text-white">
                      <div className="flex h-20 min-h-[80px] items-stretch justify-between space-x-2">
                        <div className="flex w-32 items-center justify-center">
                          <img
                            className="h-full w-full overflow-hidden rounded-3xl object-cover"
                            src="https://i.ytimg.com/vi/8r4bqa9mHWg/maxresdefault.jpg"
                          />
                        </div>
                        <div className="flex h-full w-full flex-col justify-between">
                          <div>
                            <div className="flex items-end justify-between space-x-1">
                              <h1 className="text-xl font-bold">Lofi Girl</h1>
                            </div>
                            <p className="text-sm text-self-gray">Sandbox</p>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <div className="flex items-center justify-end space-x-1">
                              <FiThumbsUp className="mb-0.5 w-4" />
                              <p className="text-right text-sm">4.8</p>
                            </div>
                            <div className="flex items-center justify-end space-x-1">
                              <FaRegCommentDots className="mb-1 w-4 text-white" />
                              <p className="text-right text-sm">2.3M</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 flex items-center justify-center">
                  <h1 className="font-bold text-self-pink">View All Posts</h1>
                </div>
              </div>
              <div className="flex w-full items-center justify-between whitespace-nowrap py-16">
                <h1 className="text-xl font-bold text-self-pink">
                  <span className="text-white underline">
                    How To Start Your
                  </span>
                  Live Stream
                </h1>
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
              <div className="flex items-center justify-center p-16">
                <button className="rounded-3xl bg-self-pink px-8 py-3 text-sm text-white">
                  Go To Profile
                </button>
              </div>
              <div className="mb-16 flex h-full flex-col rounded-3xl bg-self-dark p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-self-pink">
                    <span className="text-white underline">Most Popular</span>
                    Live Stream
                  </h2>
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
                      <p className="flex items-center space-x-1 text-sm text-self-pink ">
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
                      <p className="flex items-center space-x-1 text-sm text-self-pink ">
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
                      <p className="flex items-center space-x-1 text-sm text-self-pink ">
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
                      <p className="flex items-center space-x-1 text-sm text-self-pink ">
                        <AiFillCheckCircle className="h-4 w-4" />
                        <p>KenganC</p>
                      </p>
                      <div className="text-xl font-bold capitalize ">
                        Just talking with fans
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-22 flex items-center justify-center">
                  <button className="whitespace-nowrap rounded-3xl bg-self-pink px-6 py-3 text-sm text-white">
                    Discover All Streams
                  </button>
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
