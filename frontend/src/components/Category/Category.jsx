import { useState } from "react";
import { RxGear } from "react-icons/rx";
import EditCategory from "./EditCategory";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

function Category({ category, isOpen, setIsOpen }) {
  const [isEdit, setIsEdit] = useState(false);

  const closeHandler = () => setIsEdit(false)

  return (
    <li className="flex items-center py-1.5 ">
      {!isOpen && (
        <BiChevronRight
          className="h-[25px] w-[25px]"
          onClick={() => setIsOpen(true)}
        />
      )}
      {isOpen && (
        <BiChevronDown
          className="h-[25px] w-[25px]"
          onClick={() => setIsOpen(false)}
        />
      )}
      <p
        className={
          "text-gray-200 " +
          `${
            category.name.length > 16
              ? category.name.length > 20
                ? `text-xs`
                : `text-sm`
              : `text-base`
          }`
        }
      >
        {category.name}
      </p>
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
