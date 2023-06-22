import { RxGear } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

// components
import EditCategory from "./Edit";

// Redux Action
import { catalogueActions } from "../../store/catalogue-slice";

function Category({
  category,
  isOpen = false,
  setIsOpen = () => {},
}) {
  // redux
  const dispatch = useDispatch();
  const { isRoot } = useSelector((state) => state.auth);
  const { name } = useSelector((state) => state.catalogue);

  // custom functions
  const closeHandler = () => dispatch(catalogueActions.reset());

  if (!category) return null;
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
            category && category.name && category.name.length > 16
              ? category.name.length > 20
                ? `text-xs`
                : `text-sm`
              : `text-base`
          }`
        }
      >
        {category && category.name}
      </p>
      <div className="relative">
        {isRoot && (
          <RxGear
            className="ml-2"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(catalogueActions.set({ name: category.name }));
            }}
          />
        )}
        {name === category.name && (
          <EditCategory current={category} onClose={closeHandler} />
        )}
      </div>
    </li>
  );
}
export default Category;
