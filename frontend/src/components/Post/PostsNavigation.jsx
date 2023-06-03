import { useRouteLoaderData } from "react-router-dom";
import Catalogue from "../Category/Catalogue";
import * as categoryHelper from "../../utils/category";

function PostsNavigation() {
  const { relation, categories } = useRouteLoaderData("relation");

  const catalogue = categoryHelper.createCatalogue(relation, categories);

  return (
    <div className="min-h-screen w-72 border-r-4 bg-gray-950">
      <div className="w-72 pl-3 pr-6">
        <Catalogue catalogue={catalogue} />
      </div>
    </div>
  );
}

export default PostsNavigation;