import { useRouteLoaderData } from "react-router-dom";
import Catalogue from "../Category/Catalogue";
import * as categoryHelper from "../../utils/category";

function PostsNavigation() {
  const { relation, categories } = useRouteLoaderData("relation");

  const catalogue = categoryHelper.createCatalogue(relation, categories);

  return (
    <div className="hidden min-h-screen border-r-4 bg-gray-950 md:block md:w-60 lg:w-72">
      <div className="w-full pl-3 pr-6">
        <Catalogue catalogue={catalogue} />
      </div>
    </div>
  );
}

export default PostsNavigation;
