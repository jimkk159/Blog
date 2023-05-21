import { useLoaderData } from "react-router-dom";
import Catalogue from "./Catalogue";
import * as categoryHelper from "../utils/category";

function PostsNavigation() {
  const { categories, postsRes } = useLoaderData();

  const posts = postsRes?.data;
  const catalogue = categoryHelper.createCatalogue(posts, categories);

  return (
    <div className="w-96 bg-slate-900 ">
      <div className="w-96 px-3">
      <Catalogue catalogue={catalogue} />
      </div>
    </div>
  );
}

export default PostsNavigation;
