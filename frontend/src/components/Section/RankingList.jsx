import { useNavigate } from "react-router-dom";

// components
import SectionTitle from "./SectionTitle";
import RankItem from "../Items/Rank";

function RankingList({ posts }) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col rounded-3xl bg-self-dark p-8 lg:w-fit lg:max-w-xs">
      <div className="flex items-center justify-start">
        <SectionTitle first={"Top"} second={"Posts"} />
      </div>
      <ul className="mt-8 space-y-6 border-b border-self-gray pb-4 md:pb-8">
        {posts.slice(0, 5).map((post, index) => (
          <RankItem key={index} post={post} />
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-center lg:mt-8">
        <h1
          className="cursor-pointer font-bold text-self-pink-500 hover:text-white md:py-6 md:text-xl lg:py-0 lg:text-base"
          onClick={() => navigate("/posts")}
        >
          View All Posts
        </h1>
      </div>
    </div>
  );
}

export default RankingList;
