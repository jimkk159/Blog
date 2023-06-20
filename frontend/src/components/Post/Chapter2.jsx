// components
import { AwaitWrapper } from "../Wrapper/AwaitWrapper";

// helper
import * as helper from "../../utils/helper";

function Chapters({ post }) {
  return (
    <div className="ml-2 overflow-y-auto rounded-3xl bg-self-dark px-4 py-6 md:block xl:w-72">
      <div className="box-border flex w-full flex-col space-y-2 pl-3 pr-4 lg:pl-5 lg:pr-6">
        <h1 className="font-akaya text-4xl text-white underline lg:w-28 xl:w-40">
          Catalogue
        </h1>
        <AwaitWrapper resolve={post}>
          {(loadPost) => {
            const chapters = helper.createPostCatalogue(loadPost.content);
            return <ul>{chapters}</ul>;
          }}
        </AwaitWrapper>
      </div>
    </div>
  );
}

export default Chapters;
