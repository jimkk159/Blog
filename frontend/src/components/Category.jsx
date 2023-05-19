import { useState } from "react";
import { RxGear } from "react-icons/rx";
import EditCategory from "./UpdateCategory";

function Category({ category, onToggle }) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <li onClick={onToggle} style={{ position: "relative" }}>
      {category.name}
      <RxGear
        onClick={(e) => {
          e.stopPropagation();
          setIsEdit((prev) => !prev);
        }}
      />
      {isEdit && (
        <EditCategory current={category} onClose={() => setIsEdit(false)} />
      )}
    </li>
  );
}
export default Category;
