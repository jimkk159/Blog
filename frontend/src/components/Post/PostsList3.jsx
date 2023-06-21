// components
import Pagination from "../UI/Pagination";
import PostListItem3 from "../Items/PostListItem3";

function PostList3({
  posts,
  total,
  onNavPage,
  size = "normal",
  page = 1,
  limit = 15,
}) {
  return (
    <div className="flex h-full w-full flex-col space-y-4 rounded-3xl bg-self-dark px-4 py-8">
      <div className="overflow-auto">
        {posts &&
          posts.map((post, index) => <PostListItem3 key={index} post={post} />)}
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

export default PostList3;
