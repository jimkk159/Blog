import { useState } from "react";
import { RxGear } from "react-icons/rx";
import { useSelector } from "react-redux";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

import EditCategory from "./EditCategory";

function Category({ category, isOpen, setIsOpen }) {
  const [isEdit, setIsEdit] = useState(false);

  // redux
  const { isRoot } = useSelector((state) => state.auth);

  // custom functions
  const closeHandler = () => setIsEdit(false);

  return (
    <li className="flex items-center py-1.5 ">
      <div className="text-base">
        {!isOpen && (
          <BiChevronRight
            className="-ml-[6px] h-[25px] w-[25px]"
            onClick={() => setIsOpen(true)}
          />
        )}
        {isOpen && (
          <BiChevronDown
            className="-ml-[6px] h-[25px] w-[25px]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
      <p
        className={
          "truncate text-gray-200 " +
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
        {isRoot && (
          <RxGear
            className="ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsEdit((prev) => !prev);
            }}
          />
        )}
        {isEdit && <EditCategory current={category} onClose={closeHandler} />}
      </div>
    </li>
  );
}
export default Category;
