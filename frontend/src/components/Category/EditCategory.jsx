import { RxCross1 } from "react-icons/rx";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";

// components
import Button from "../UI/Button";
import MultiSelectInput from "../UI/MultiSelectInput";

// hooks
import useForm from "../../hooks/form-hook";

function EditCategory({ current, onClose }) {
  const [isDrop, setIsDrop] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // react-router
  const navigate = useNavigate();
  const token = useRouteLoaderData("root");
  const { categories } = useRouteLoaderData("relation");
  const choices =
    categories.map((el) => ({
      ...el,
      value: el.id,
    })) ?? [];

  // custom hooks
  const { formState, inputHandler, setFormData } = useForm(
    {
      CategoryId: { value: "", isValid: false },
      ParentId: { value: "", isValid: false },
    },
    false
  );

  // custom functions
  const ParentId = formState.inputs.ParentId.value;
  const CategoryId = formState.inputs.CategoryId.value;
  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsUpdating(true);
      if (!!ParentId) {
        await fetch(
          process.env.REACT_APP_BACKEND_URL +
            `/api/v1/categories/${CategoryId}`,
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
      setIsUpdating(false);
      navigate(0);
    },
    [navigate, token, CategoryId, ParentId]
  );

  const deleteHandler = useCallback(async () => {
    setIsDeleting(true);
    await fetch(
      process.env.REACT_APP_BACKEND_URL + `/api/v1/categories/${CategoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    ).catch((err) => err);
    setIsDeleting(false);
    navigate(0);
  }, [navigate, token, CategoryId]);

  // useEffects
  useEffect(() => {
    if (current) {
      setFormData(
        {
          CategoryId: { value: current.id, isValid: true },
          ParentId: { value: current.ParentId, isValid: false },
        },
        false
      );
    }
  }, [current, setFormData]);

  return (
    <form
      onSubmit={submitHandler}
      onClick={(e) => e.stopPropagation()}
      className="absolute left-8 top-0 z-10 w-60 bg-slate-100 p-3 text-gray-800 "
    >
      <RxCross1
        className="absolute right-1.5 top-1.5 h-3 w-3"
        onClick={onClose}
      />
      <MultiSelectInput
        name="ParentId"
        defaultName="None"
        choices={choices}
        choiceElement={<li />}
        defaultValue="Blongs to..."
        current={current}
        isDrop={isDrop}
        onDrop={setIsDrop}
        onInput={inputHandler}
      />

      <div className="mt-1 flex w-full justify-end pt-0.5">
        <Button
          type="submit"
          disabled={!formState.isValid || isUpdating}
          loading={isUpdating}
          spinner={{ size: 15 }}
          className={
            "ml-1.5 rounded-lg bg-blue-700 p-2 text-xs font-bold text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300" +
            "disabled:border-blue-300 disabled:bg-blue-300 "
          }
        >
          Update
        </Button>
        <Button
          type="button"
          disabled={isDeleting}
          loading={isDeleting}
          spinner={{ size: 15, color: "disabled:text-blue-300" }}
          onClick={deleteHandler}
          className={
            "ml-1.5 rounded-lg border border-blue-700 p-2 text-center text-xs font-bold text-blue-700 shadow-md " +
            "focus:outline-none focus:ring-4 focus:ring-blue-300 " +
            "hover:bg-blue-600 hover:text-white " +
            "disabled:border-blue-300 disabled:text-blue-300 disabled:hover:border-blue-300 disabled:hover:bg-blue-300 disabled:hover:text-white  "
          }
        >
          Delete This
        </Button>
      </div>
    </form>
  );
}

export default EditCategory;
