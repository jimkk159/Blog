import { useReducer, useCallback, useEffect } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";

const initialState = {
  id: null,
  name: "",
  ParentId: "1",
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

function EditCategory({ mode, current, onClose }) {
  const [formData, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const token = useRouteLoaderData("root");
  const { categories } = useRouteLoaderData("posts");

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    dispatch({ type: "UPDATE", field: name, value });
  };

  const categoryId = formData.id;
  const categoryName = formData.name;
  const ParentId = formData.ParentId;
  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (mode === "new") {
        await fetch(
          process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/categories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              name: categoryName,
              ParentId,
            }),
          }
        ).catch((err) => err);
      } else {
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
    [navigate, token, mode, categoryId, categoryName, ParentId]
  );

  const deleteHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
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
    },
    [navigate, token, categoryId]
  );
  useEffect(() => {
    if (current) {
      dispatch({ type: "UPDATE", field: "id", value: current.id });
      dispatch({ type: "UPDATE", field: "ParentId", value: current.ParentId });
    }
  }, [dispatch, current]);

  return (
    <div style={{ width: 120, padding: 10 }}>
      <div>Blongs to</div>
      <form onSubmit={submitHandler}>
        <select
          id="ParentId"
          name="ParentId"
          value={formData.ParentId}
          onChange={inputChangeHandler}
        >
          {categories &&
            categories.length &&
            (mode === "new"
              ? categories.map((el, index) => {
                  let name = el.name;
                  if (el.name === "root") name = "Top";
                  return (
                    <option key={index} value={el.id}>
                      {name}
                    </option>
                  );
                })
              : categories
                  .filter((el) => current.id !== el.id)
                  .map((el, index) => {
                    let name = el.name;
                    if (el.name === "root") name = "None";
                    return (
                      <option key={index} value={el.id}>
                        {name}
                      </option>
                    );
                  }))}
        </select>
        {mode === "new" ? (
          <>
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={inputChangeHandler}
            />
          </>
        ) : null}
        <button type="submit">Confirm</button>
        {mode !== "new" ? (
          <button type="button" onClick={deleteHandler}>
            Delete
          </button>
        ) : null}
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditCategory;
