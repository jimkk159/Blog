import { FiThumbsUp } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";

function CarouselItem({ post }) {
  return (
    <div className="flex items-center justify-center">
      <div className="my-8 flex w-full max-w-[270px] flex-col space-y-6 rounded-3xl border-2 border-zinc-600 p-2 py-4 text-white md:p-4">
        <div className="h-[421px] w-full">
          <img
            alt="preview"
            title={post.title}
            className="h-full w-full rounded-3xl object-cover"
            src={post.previewImg}
          />
        </div>
        <div className="flex h-full items-end justify-between">
          <div className="flex h-14 flex-col justify-between">
            <p className="text-xl font-bold">CS-GO</p>
            <p className="text-sm text-self-gray">249K Downloads</p>
          </div>
          <div className="flex flex-col items-start space-y-0.5">
            <div className="flex items-center justify-end space-x-1">
              <FiThumbsUp className="mb-0.5 w-4" />
              <p className="text-right text-sm">4.8</p>
            </div>
            <div className="flex items-center justify-end space-x-1">
              <FaRegCommentDots className="w-4 text-white" />
              <p className="text-right text-sm">2.3M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarouselItem;
