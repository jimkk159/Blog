import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { useRouteLoaderData } from "react-router-dom";

// components
import Catalogue from "../Category/Catalogue";

// Redux Actions
import { catalogueActions } from "../../store/catalogue-slice";

// helper
import * as categoryHelper from "../../utils/category";

import { posts, categories } from "../../routes/pages/data";

function PostsNavigation() {
  // redux
  const dispatch = useDispatch();

  // react-router
  // const { relation, categories } = useRouteLoaderData("relation");
  const catalogue = categoryHelper.createCatalogue(posts, categories);

  useEffect(() => {
    dispatch(catalogueActions.reset());
  }, [dispatch]);

  return (
    <div className="max-h-[512px] rounded-3xl bg-self-dark md:block md:w-44 lg:w-52 xl:w-60">
      <div className="box-border w-full py-8 pl-3 pr-4 lg:pl-5 lg:pr-6">
        <Catalogue catalogue={catalogue} />
      </div>
    </div>
  );
}

export default PostsNavigation;
