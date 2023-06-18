import {
  defer,
  redirect,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import { useMediaQuery } from "react-responsive";

// components
import Container from "../../../components/UI/Container";
import PostsList from "../../../components/Post/PostsList";
import PostsNavigation2 from "../../../components/Post/PostsNavigation2";

// helper
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";

const defaultPage = 1;
const defaultLimit = 15;
function Search() {
  // react-router
  const { posts } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get("mode") ?? "category";
  const type = searchParams.get("type") ?? "text";
  const target = searchParams.get("target") ?? "";
  const limit = searchParams.get("limit") ?? defaultLimit;

  // import hooks
  const matches1024 = useMediaQuery({ query: "(max-width: 1024px)" });

  // custom functions
  const navPageHandler = (nextPage) =>
    setSearchParams({ mode, type, target, page: nextPage, limit });

  const left = !matches1024 && (
    <div className="flex w-full justify-end pr-2">
      <PostsNavigation2 />
    </div>
  );

  return (
    <Container left={left}>
      <div className="w-full rounded-3xl bg-self-dark-gray p-6">
        <div className="mb-4 mt-8 h-8 w-full px-4 text-zinc-500">
          <h1 className="mb-8 mt-1 w-full border-b border-self-gray text-3xl">
            Search:
            <span className="pl-2 text-2xl text-gray-400">{`${type} of ${mode} is ${target}`}</span>
          </h1>
        </div>
        <AwaitWrapper resolve={posts}>
          {(loadPosts) => {
            return (
              <PostsList
                posts={loadPosts}
                total={loadPosts.length}
                onNavPage={navPageHandler}
              />
            );
          }}
        </AwaitWrapper>
      </div>
    </Container>
  );
}

export default Search;

async function postsLoader({ mode, type, target, page, limit }) {
  if (!(mode && type && target))
    return {
      total: 0,
      data: [],
    };

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/search?mode=${mode}&type=${type}&target=${target}` +
      `&page=${page ? page : defaultPage}&limit=${limit ? limit : defaultLimit}`
  );
  if (!response.ok) throw new Error();

  const resJSON = await response.json();
  return resJSON.data;
}

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode");
  const type = searchParams.get("type");
  const target = searchParams.get("target");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  return defer({
    posts: postsLoader({ mode, type, target, page, limit }),
  });
}

export async function action({ request }) {
  const data = await request.formData();
  const mode = data.get("mode").toLowerCase();
  const target = data.get("target");
  const page = data.get("page");
  const limit = data.get("limit");

  return redirect(
    `/posts/search?mode=${mode}&type=text&target=${target}` +
      `${page ? `&page=${page}` : ""}` +
      `${limit ? `&limit=${limit}` : ""}`
  );
}
