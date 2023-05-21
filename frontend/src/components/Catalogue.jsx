import { useState } from "react";
import { Link } from "react-router-dom";
import Category from "./Category";
import EditCategory from "./EditCategory";

function Catalogue({ catalogue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  if (!catalogue.ParentId)
    return (
      <>
        {catalogue.children.map((child, index) => (
          <Catalogue key={index} catalogue={child} />
        ))}
        <p onClick={() => setIsEdit((prev) => !prev)}>+</p>
        {isEdit && (
          <EditCategory
            mode="new"
            catagories={catalogue}
            onClose={() => setIsEdit(false)}
          />
        )}
      </>
    );

  return (
    <ul>
      <Category
        category={catalogue}
        onToggle={() => setIsOpen((prev) => !prev)}
      />
      {isOpen &&
        catalogue.children.map((child, index) => (
          <Catalogue key={index} catalogue={child} />
        ))}
      {isOpen && (
        <ul>
          {catalogue.posts.map((post, index) => (
            <li key={index}>
              <Link to={`/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </ul>
  );
}

export default Catalogue;
