import TopPostItem from "../Items/TopPostItem";
import SectionTitle from "./SectionTitle";

function RankingListSection({ posts }) {
  return (
    <div className="flex h-full w-full flex-col rounded-3xl bg-self-dark p-8 lg:w-fit">
      <div className="flex items-center justify-start">
        <SectionTitle first={"Top"} second={"Posts"} />
      </div>
      <ul className="mt-8 space-y-6 border-b border-self-gray pb-4">
        {posts.slice(0, 5).map((post, index) => (
          <TopPostItem key={index} post={post} />
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-center lg:mt-8">
        <h1 className="font-bold text-self-pink-500 md:py-6 md:text-xl lg:py-0 lg:text-base">
          View All Posts
        </h1>
      </div>
    </div>
  );
}

export default RankingListSection;
