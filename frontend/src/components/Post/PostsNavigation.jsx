import { useRouteLoaderData } from "react-router-dom";

// components
import Catalogue from "../Category/Catalogue";
import * as categoryHelper from "../../utils/category";
import { AwaitWrapper } from "../Wrapper/AwaitWrapper";

function PostsNavigation() {
  // react-router
  const { relation } = useRouteLoaderData("relation");

  return (
    <div className="hidden min-h-screen border-r-4 bg-gray-950 md:block md:w-44 lg:w-52 xl:w-60">
      <div className="box-border w-full py-12 pl-3 pr-4 lg:pl-3 lg:pr-5">
        <AwaitWrapper resolve={relation}>
          {(response) => {
            const posts = response?.data?.posts?.data;
            const categories = response?.data?.categories?.data;
            const catalogue = categoryHelper.createCatalogue(posts, categories);

            return <Catalogue catalogue={catalogue} />;
          }}
        </AwaitWrapper>
      </div>
    </div>
  );
}

export default PostsNavigation;
