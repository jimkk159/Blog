import { NavLink, useLoaderData, useRouteLoaderData } from "react-router-dom";
import Catalogue from "./Catalogue";
import * as categoryHelper from "../util/category";

function PostsNavigation() {
  const token = useRouteLoaderData("root");
  const { categories, posts } = useLoaderData();
  const catalogue = categoryHelper.createCatalogue(posts, categories);

  return (
    <>
      <ul>
        {token && (
          <li>
            <NavLink to="/new">New Post</NavLink>
          </li>
        )}
      </ul>
      <Catalogue catalogue={catalogue} />
    </>
  );
}

export default PostsNavigation;
