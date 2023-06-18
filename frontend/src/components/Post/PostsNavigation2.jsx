import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouteLoaderData } from "react-router-dom";

// components
import Catalogue from "../Category/Catalogue";
import { AwaitWrapper } from "../../routes/helper/Wrapper";

// Redux Actions
import { catalogueActions } from "../../store/catalogue-slice";

// helper
import * as categoryHelper from "../../utils/category";

function PostsNavigation2({ limit }) {
  // redux
  const dispatch = useDispatch();

  // react-router
  const { relation } = useRouteLoaderData("relation");

  useEffect(() => {
    dispatch(catalogueActions.reset());
  }, [dispatch]);

  return (
    <div
      className={`${
        limit && "max-h-[512px]"
      } overflow-y-auto rounded-3xl bg-self-dark md:block md:w-44 lg:w-52 xl:w-60`}
    >
      <div className="box-border w-full py-8 pl-3 pr-4 lg:pl-5 lg:pr-6">
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

export default PostsNavigation2;
