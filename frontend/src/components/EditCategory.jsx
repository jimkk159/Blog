import { useReducer, useCallback, useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BiChevronDown } from "react-icons/bi";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import CloneComponents from "./CloneComponent";

const initialState = {
  id: null,
  name: "",
  ParentId: "1",
  parent: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

function ChoiceChild({ className, children, categories, current, onClick }) {
  if (!categories) return;
  if (!categories.length) return;

  return categories
    .filter((el) => current.id !== el.id)
    .map((el, index) => {
      const name = el.name === "root" ? "None" : el.name;
      return (
        <CloneComponents
          key={index}
          className={className}
          components={children}
          value={el.id}
          onClick={(e) => onClick(e, name)}
        >
          {name}
        </CloneComponents>
      );
    });
}

function EditCategory({ current, onClose }) {
  const [isDrop, setIsDrop] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [formData, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const token = useRouteLoaderData("root");
  const { categories } = useRouteLoaderData("posts");

  const clickHandler = (event, name) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch({ type: "UPDATE", field: "ParentId", value: event.target.value });
    dispatch({ type: "UPDATE", field: "parent", value: name });
    setIsSelected(true);
    setIsDrop(false);
  };

  const categoryId = formData.id;
  const parentName = formData.parent;
  const ParentId = formData.ParentId;
  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!!parentName) {
        await fetch(
          process.env.REACT_APP_BACKEND_URL +
            `/api/v1/blog/categories/${categoryId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ ParentId }),
          }
        ).catch((err) => err);
      }
      dispatch({ type: "RESET" });
      navigate(0);
    },
    [navigate, token, categoryId, parentName, ParentId]
  );

  const deleteHandler = useCallback(async () => {
    await fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/api/v1/blog/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    ).catch((err) => err);
    navigate(0);
  }, [navigate, token, categoryId]);

  useEffect(() => {
    if (current) {
      dispatch({ type: "UPDATE", field: "id", value: current.id });
      dispatch({ type: "UPDATE", field: "ParentId", value: current.ParentId });
    }
  }, [dispatch, current]);

  return (
    <form
      onSubmit={submitHandler}
      onClick={(e) => e.stopPropagation()}
      className="absolute left-8 top-0 z-10 w-60 bg-slate-50 p-3 text-gray-800"
    >
      <select
        id="ParentId"
        name="ParentId"
        className="hidden"
        value={formData.ParentId}
        readOnly
      >
        <ChoiceChild
          categories={categories}
          current={current}
          children={<option />}
        />
      </select>
      <RxCross1
        className="absolute right-1.5 top-1.5 h-3 w-3"
        onClick={onClose}
      />
      <div className="relative mr-2 mt-2 flex w-full items-center justify-center gap-5">
        <button
          type="button"
          className="relative flex w-full items-center justify-center rounded border bg-white text-gray-600 shadow ring-gray-200 focus:outline-none"
          onClick={() => setIsDrop((prev) => !prev)}
        >
          <label
            htmlFor="ParentId"
            className={`w-full cursor-pointer px-4 text-gray-500 ${
              formData.parent.length > 14 ? " text-xs" : " text-sm"
            }`}
          >
            {isSelected ? formData.parent : "Blongs to..."}
          </label>
          <BiChevronDown className="h-[25px] w-[25px]" />
          <div
            className={
              `absolute top-full mt-1 w-max min-w-full bg-white shadow` +
              `${isDrop ? "" : " hidden"}`
            }
          >
            <ul className="rounded border text-left">
              <ChoiceChild
                className="border-b px-4 py-1 text-sm hover:bg-gray-100"
                categories={categories}
                current={current}
                children={<li />}
                onClick={clickHandler}
              />
            </ul>
          </div>
        </button>
      </div>
      <div className="mt-1 flex w-full justify-end pt-0.5">
        <button
          type="submit"
          className="ml-1.5 rounded-lg bg-blue-700 p-2 text-xs font-bold text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
        >
          Update
        </button>
        <button
          type="button"
          onClick={deleteHandler}
          className="ml-1.5 rounded-lg border border-blue-700 p-2 text-center text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
        >
          Delete This
        </button>
      </div>
    </form>
  );
}

export default EditCategory;
