// components
import PinkButton from "../UI/PinkButton";
import SectionTitle from "./SectionTitle";
import LibraryItem from "../Items/LibraryItem";

function MyPostLibrary({ posts }) {

  return (
    <div className="mb-16 flex h-full flex-col space-y-4 rounded-3xl bg-self-dark px-4 py-8 md:p-8">
      <div className="flex items-center justify-between pb-4">
        <SectionTitle first={"Your Posts"} second={"Library"} />
      </div>
      <div className="overflow-auto h-[1024px] md:h-[1040px] lg:h-[480px]">
        {posts &&
          posts.map((post, index) => <LibraryItem key={index} post={post} />)}
      </div>
      <div className="pt-8">
        <PinkButton text={"View Your Library"} />
      </div>
    </div>
  );
}

export default MyPostLibrary;
