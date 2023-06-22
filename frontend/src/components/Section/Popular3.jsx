import { useMediaQuery } from "react-responsive";

// components
import PinkButton from "../UI/PinkButton";
import SectionTitle from "./SectionTitle";
import PopularItem3 from "../UI/Items/Popular3";

function Popular3({ posts }) {
  let popular = null;
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });

  if (matches768 && matches1024)
    popular = (
      <div className="my-8 flex flex-col items-center justify-center space-y-4">
        {posts &&
          posts.slice(0, 8).map((post, index) => {
            if (index % 4 === 0) {
              const Item2 =
                posts.length > index + 1 ? (
                  <PopularItem3 key={index + 1} post={posts[index + 1]} />
                ) : null;
              const Item3 =
                posts.length > index + 2 ? (
                  <PopularItem3 key={index + 2} post={posts[index + 2]} />
                ) : null;
              const Item4 =
                posts.length > index + 3 ? (
                  <PopularItem3 key={index + 3} post={posts[index + 3]} />
                ) : null;
              return (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <PopularItem3 key={index} post={post} />
                  {Item2}
                  {Item3}
                  {Item4}
                </div>
              );
            }
            return null;
          })}
      </div>
    );
  else if (matches768) {
    popular = (
      <div className="my-8 flex flex-col items-center justify-center space-y-6">
        {posts &&
          posts.slice(0, 6).map((post, index) => {
            const nextItem =
              posts.length > index + 1 ? (
                <PopularItem3 key={index + 1} post={posts[index + 1]} />
              ) : null;

            if (index % 2 === 0) {
              return (
                <div key={index} className="grid grid-cols-2 gap-6">
                  <PopularItem3 key={index} post={post} />
                  {nextItem}
                </div>
              );
            }
            return null;
          })}
      </div>
    );
  } else
    popular = (
      <div className="my-8 flex flex-col items-center justify-center space-y-6">
        {posts &&
          posts
            .slice(0, 3)
            .map((post, index) => <PopularItem3 key={index} post={post} />)}
      </div>
    );

  return (
    <div className="mb-16 flex h-full flex-col rounded-3xl bg-self-dark px-4 py-8 md:p-8">
      <div className="flex items-center justify-between">
        <SectionTitle first={"Most Popular"} second={"Right Now"} />
      </div>
      {popular}
      <div className="pt-22">
        <PinkButton text={"Discover All Posts"} />
      </div>
    </div>
  );
}

export default Popular3;
