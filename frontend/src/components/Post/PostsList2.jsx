// components
import Pagination from "../UI/Pagination";
import PostListItem from "../Items/PostListItem";

function PostsList2({
  posts,
  total,
  onNavPage,
  size = "normal",
  page = 1,
  limit = 15,
}) {
  return (
    <div className="mb-16 flex h-full flex-col space-y-4 rounded-3xl bg-self-dark px-4 py-8 md:p-8">
      <div className="overflow-auto">
        {posts &&
          posts.map((post, index) => <PostListItem key={index} post={post} />)}
      </div>
      <div className="w-full max-w-5xl">
        <Pagination
          size={size}
          total={total}
          current={page}
          limit={limit}
          onNavPage={onNavPage}
        />
      </div>
    </div>
  );
}

export default PostsList2;
