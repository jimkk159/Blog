// components
import Popular2 from "../../components/Section/Popular2";

import MyPostLibrary from "../../components/Section/MyPostLibrary";
// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { posts } from "./data";

function Home() {

  return (
    <div className="rounded">
      <div className="h-full  px-6 py-12">
        <div className="flex justify-center">
          <div className="h-full w-full max-w-5xl rounded-3xl bg-self-dark-gray p-6">
            <Popular2 posts={posts} slide />
            <div className="my-16 w-full border-b border-self-gray" />
            <MyPostLibrary posts={posts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
