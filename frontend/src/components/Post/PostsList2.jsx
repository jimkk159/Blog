// components
import LibraryItem from "../UI/Items/LibraryItem";

function PostsList2({ posts }) {

  return (
    <div className="mb-16 flex h-full flex-col space-y-4 rounded-3xl bg-self-dark px-4 py-8 md:p-8">
      <div className="overflow-auto h-[1024px] md:h-[1040px] lg:h-[480px]">
        {posts &&
          posts.map((post, index) => <LibraryItem key={index} post={post} />)}
      </div>
    </div>
  );
}

export default PostsList2;
