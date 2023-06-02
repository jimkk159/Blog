import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Category from "./Category";
import CreateCategory from "./CreateCategory";

function Catalogue({ catalogue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const navigate = useNavigate();

  if (!catalogue.ParentId)
    return (
      <>
        {catalogue.children.map((child, index) => (
          <Catalogue key={index} catalogue={child} />
        ))}
        <div className="relative">
          <button
            className={
              "mt-1.5 w-full rounded border bg-gray-200 text-center text-slate-800 ring-1 hover:bg-gray-300 " +
              `${isDrop ? "text-base p-1 " : "text-2xl p-0.5"}`
            }
            onClick={() => setIsDrop((prev) => !prev)}
          >
            {isDrop ? "Create New Category" : "+"}
          </button>
          {isDrop && (
            <CreateCategory
              catagories={catalogue}
              onClose={() => setIsDrop(false)}
            />
          )}
        </div>
      </>
    );

  return (
    <ul
      className={
        "border-t-2 pl-3 " +
        `${
          (catalogue.children.length || catalogue.posts.length) &&
          "divide-y-2 divide-gray-400"
        }`
      }
    >
      <Category category={catalogue} isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen &&
        catalogue.children.map((child, index) => (
          <Catalogue key={index} catalogue={child} />
        ))}
      {isOpen && (
        <ul className="divide-y-2 divide-gray-500 pl-4 text-gray-400">
          {catalogue.posts.map((post, index) => (
            <li
              key={index}
              className="cursor-pointer truncate py-1.5 text-base hover:text-gray-200 active:text-gray-200"
              onClick={() => navigate(`/${post.id}`)}
            >
              <Link to={`/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </ul>
  );
}

export default Catalogue;
