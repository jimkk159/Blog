import { useState } from "react";
import { Link } from "react-router-dom";

function Catalogue({ catalogue }) {
  const [isOpen, setIsOpen] = useState(false);
  const openFolderHandler = () => setIsOpen((prev) => !prev);

  return (
    <ul>
      <li onClick={openFolderHandler}>{catalogue.name}</li>{" "}
      {isOpen &&
        catalogue.children.map((child, index) => (
          <Catalogue key={index} catalogue={child} />
        ))}
      {isOpen && (
        <ul>
          {catalogue.posts.map((post, index) => (
            <li key={index}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </ul>
  );
}

export default Catalogue;
