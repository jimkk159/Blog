import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Category from "./Category";
import CreateCategory from "./CreateCategory";

function Catalogue({ catalogue, isFirst }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const navigate = useNavigate();

  if (!catalogue.ParentId)
    return (
      <>
        {catalogue.children.map((child, index) => (
          <Catalogue key={index} isFirst catalogue={child} />
        ))}
        <div className="relative">
          <button
            className={
              "mt-1.5 w-full rounded border bg-gray-200 text-center text-slate-800 ring-1 hover:bg-gray-300 " +
              `${isDrop ? "p-1 text-base " : "p-0.5 text-2xl"}`
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
        "border-t-2 " +
        `${isFirst ? "" : "pl-2 "}` +
        `${catalogue.children.length || catalogue.posts.length}`
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
              className={
                `${index === 0 ? "border-t-2 border-t-gray-500" : ""}` +
                ` cursor-pointer truncate py-1.5 text-base hover:text-gray-200 active:text-gray-200`
              }
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
