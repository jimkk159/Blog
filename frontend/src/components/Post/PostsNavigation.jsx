import { useRouteLoaderData } from "react-router-dom";
import Catalogue from "../Category/Catalogue";
import * as categoryHelper from "../../utils/category";

function PostsNavigation() {
  const { relation, categories } = useRouteLoaderData("relation");

  const catalogue = categoryHelper.createCatalogue(relation, categories);

  return (
    <div className="hidden min-h-screen border-r-4 bg-gray-950 md:block md:w-44 lg:w-52 xl:w-60">
      <div className="box-border w-full py-12 pl-3 pr-4 lg:pl-3 lg:pr-5">
        <Catalogue catalogue={catalogue} />
      </div>
    </div>
  );
}

export default PostsNavigation;
