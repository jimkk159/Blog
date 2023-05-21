import { useState } from "react";
import { RxGear } from "react-icons/rx";
import EditCategory from "./EditCategory";

function Category({ category, onToggle }) {
  const [isEdit, setIsEdit] = useState(false);

  const closeHandler = () => setIsEdit(false);
  
  return (
    <li onClick={onToggle} className="flex items-center px-3 py-3">
      <p>{category.name}</p>
      <div className="relative">
        <RxGear
          className="ml-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsEdit((prev) => !prev);
          }}
        />
        {isEdit && <EditCategory current={category} onClose={closeHandler} />}
      </div>
    </li>
  );
}
export default Category;
