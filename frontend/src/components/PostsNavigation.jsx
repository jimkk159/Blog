import { useLoaderData } from "react-router-dom";
import Catalogue from "./Catalogue";
import * as categoryHelper from "../utils/category";

function PostsNavigation() {
  const { categories, postsRes } = useLoaderData();

  const posts = postsRes?.data;
  const catalogue = categoryHelper.createCatalogue(posts, categories);

  return <Catalogue catalogue={catalogue} />;
}

export default PostsNavigation;
