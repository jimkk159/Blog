import { useReducer, useCallback, useState } from "react";
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

function ChoiceChild({ className, children, categories, onClick }) {
  if (!categories) return;
  if (!categories.length) return;

  return categories.map((el, index) => {
    const name = el.name === "root" ? "Top" : el.name;
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

function CreateCategory({ onClose }) {
  const [isDrop, setIsDrop] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [formData, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const token = useRouteLoaderData("root");
  const { categories } = useRouteLoaderData("relation");

  const inputHandler = useCallback((event) => {
    dispatch({ type: "UPDATE", field: "name", value: event.target.value });
  }, []);

  const clickHandler = useCallback((event, name) => {
    event.preventDefault();
    dispatch({ type: "UPDATE", field: "ParentId", value: event.target.value });
    dispatch({ type: "UPDATE", field: "parent", value: name });
    setIsSelected(true);
    setIsDrop(false);
  }, []);

  const name = formData.name;
  const ParentId = formData.ParentId;
  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (name) {
        await fetch(
          process.env.REACT_APP_BACKEND_URL + `/api/v1/categories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              name,
              ParentId,
            }),
          }
        ).catch((err) => err);
      }

      dispatch({ type: "RESET" });
      navigate(0);
    },
    [navigate, token, name, ParentId]
  );

  return (
    <form
      onSubmit={submitHandler}
      onClick={(e) => {
        e.stopPropagation();
        if (isDrop) setIsDrop(false);
      }}
      className="bg-slate-50 p-3 text-gray-800"
      onBlur={() => setIsDrop(false)}
    >
      <select
        id="ParentId"
        name="ParentId"
        className="hidden"
        value={formData.ParentId}
        readOnly
      >
        <ChoiceChild categories={categories} children={<option />} />
      </select>
      <p className="pb-2 pl-1 pt-2 text-base font-bold">Name</p>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        placeholder="Category...."
        className="h-8 w-full border border-gray-500 pl-2 text-base outline-none"
        onChange={inputHandler}
      />
      <p className="pl-1 pt-4 text-base font-bold">Parent</p>
      <div className="mr-2 mt-2 flex w-full items-center justify-center gap-5">
        <button
          type="button"
          className="flex w-full flex-col items-center justify-center rounded border bg-white  text-gray-600 shadow ring-gray-200 focus:outline-none"
        >
          <div
            className={"flex w-full items-center "}
            onClick={(e) => {
              e.preventDefault();
              setIsDrop((prev) => !prev);
            }}
          >
            <label
              htmlFor="ParentId"
              className={`w-full cursor-pointer px-4 py-1 text-sm whitespace-nowrap text-gray-500 hover:bg-gray-50`}
            >
              {isSelected ? formData.parent : "This category belongs to..."}
            </label>
            <BiChevronDown className="mr-2 h-[25px] w-[25px]" />
          </div>
          <div
            className={
              `top-full mt-1 w-max min-w-full bg-white shadow` +
              `${isDrop ? "" : " hidden"}`
            }
          >
            <ul className="rounded border text-left">
              <ChoiceChild
                className="border-b px-2 py-1 text-base hover:bg-gray-100"
                categories={categories}
                children={<li />}
                onClick={clickHandler}
              />
            </ul>
          </div>
        </button>
      </div>
      <div className="mt-4 flex w-full justify-end pt-0.5">
        <button
          type="submit"
          className="ml-1.5 rounded-lg bg-blue-700 p-2 text-xs font-bold text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
        >
          Create
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-1.5 rounded-lg border border-blue-700 p-2 text-center text-xs font-bold text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CreateCategory;
