import { useMediaQuery } from "react-responsive";

// components
import Button from "../Button";

// custom functions
import { creatPreviewImg } from "../../utils/helper";

//helper
import { formatDate } from "../../utils/helper";

function LiItem1({ title, content }) {
  return (
    <li className="flex h-full flex-col items-start justify-start pt-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="line-clamp-2 w-28 overflow-ellipsis text-xl">{content}</p>
    </li>
  );
}

function LiItem2({ title, content }) {
  return (
    <li className="flex h-full flex-col items-start justify-start pt-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="line-clamp-2 w-28 whitespace-nowrap">{content}</p>
    </li>
  );
}

function LiItem3({ title, content }) {
  return (
    <li className="flex h-full flex-col items-start justify-center">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="w-64 truncate text-xl">{content}</p>
    </li>
  );
}

function LiItem4({ title, content }) {
  return (
    <li className="flex h-full flex-col items-center justify-center">
      <h1 className="font-bold text-white">{title}</h1>
      <p className="w-32 truncate text-center">{content}</p>
    </li>
  );
}

function LibraryItem({ post }) {
  // import hooks
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });
  const matches1024 = useMediaQuery({ query: "(min-width: 1024px)" });
  if (!post) return null;
  if (matches1024) {
    return (
      <div className="flex items-center justify-center border-b border-self-gray py-4">
        <ul className="grid w-full grid-flow-col gap-4">
          <img
            className="h-32 w-32 rounded-3xl border border-self-gray object-cover"
            alt="preview"
            src={creatPreviewImg(post.previewImg)}
          />
          <LiItem1 title="Title" content={post.title} />
          <LiItem1 title="Category" content={post.Category.name} />
          <LiItem2 title="Date" content={formatDate(post.editedAt)} />
          <LiItem1 title="Author" content={post.Author.name} />
          <div className="flex w-full items-center justify-start">
            <Button
              type="button"
              //   disabled={isSubmitting}
              //   loading={true}
              className={
                "ml-4 rounded-3xl border-2 border-self-gray bg-transparent px-8 py-2.5 text-self-gray shadow-xl " +
                "hover:border-self-pink-500 hover:text-self-pink-500"
              }
              spinner={{ color: "text-self-pink-500" }}
            >
              Browse
            </Button>
          </div>
        </ul>
      </div>
    );
  }

  if (matches768) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 border-b border-self-gray pb-8 pt-4">
        <ul className="grid w-full grid-cols-2 gap-y-6">
          <img
            className="h-32 w-32 rounded-3xl border border-self-gray object-cover"
            alt="preview"
            src={creatPreviewImg(post.previewImg)}
          />
          <LiItem3 title="Title" content={post.title} />
          <LiItem3 title="Category" content={post.Category.name} />
          <LiItem3 title="Date" content={formatDate(post.editedAt)} />
          <LiItem3 title="Author" content={post.Author.name} />
          <div className="flex w-full items-center justify-start">
            <Button
              type="button"
              //   disabled={isSubmitting}
              //   loading={true}
              className={
                "ml-4 rounded-3xl border-2 border-self-gray bg-transparent px-8 py-2.5 text-self-gray shadow-xl " +
                "hover:border-self-pink-500 hover:text-self-pink-500"
              }
              spinner={{ color: "text-self-pink-500" }}
              textProps={{ className: "text-2xl" }}
            >
              Browse
            </Button>
          </div>
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 border-b border-self-gray pb-8 pt-4">
      <img
        className="h-20 w-20 rounded-3xl border border-self-gray object-cover"
        alt="preview"
        src={creatPreviewImg(post.previewImg)}
      />
      <ul className="grid grid-cols-2 gap-y-6">
        <LiItem4 title="Title" content={post.title} />
        <LiItem4 title="Category" content={post.Category.name} />
        <LiItem4 title="Date" content={formatDate(post.editedAt)} />
        <LiItem4 title="Author" content={post.Author.name} />
      </ul>
      <div className="flex w-full items-center justify-center">
        <Button
          type="button"
          //   disabled={isSubmitting}
          //   loading={true}
          className={
            "ml-4 rounded-3xl border-2 border-self-gray bg-transparent px-4 py-1.5 text-self-gray shadow-xl " +
            "hover:border-self-pink-500 hover:text-self-pink-500"
          }
          spinner={{ color: "text-self-pink-500" }}
        >
          Browse
        </Button>
      </div>
    </div>
  );
}

export default LibraryItem;
