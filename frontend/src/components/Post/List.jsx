import { useSearchParams } from "react-router-dom";

// components
import Pagination from "../UI/Pagination";
import PostListItem from "../Items/List";

const defaultPage = 1;
const defaultLimit = 15;

function List({
  posts,
  total,
  onNavPage,
  size = "normal",
  page: inputPage,
  limit: inputLimit,
}) {
  // react-router
  const [searchParams] = useSearchParams();

  const page = inputPage ?? searchParams.get("page") ?? defaultPage;
  const limit = inputLimit ?? searchParams.get("limit") ?? defaultLimit;

  if (!posts || !Array.isArray(posts))
    return (
      <div className="flex flex-col">
        <ul className="w-full max-w-5xl"></ul>
      </div>
    );

  return (
    <div className="mb-16 flex h-full w-full flex-col space-y-4 rounded-3xl bg-self-dark px-4 py-8">
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

export default List;
