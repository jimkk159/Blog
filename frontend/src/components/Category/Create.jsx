import validator from "validator";
import { useState, useCallback } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";

// components
import Input from "../UI/Input";
import Button from "../UI/Button";
import MultiSelectInput from "../UI/MultiSelectInput";
import { AwaitWrapper } from "../Wrapper/AwaitWrapper";

// hooks
import useForm from "../../hooks/form-hook";

function CreateCategory({ onClose }) {
  const [isDrop, setIsDrop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // react-router
  const navigate = useNavigate();
  const { token } = useRouteLoaderData("root");
  const { relation } = useRouteLoaderData("relation");

  // custom hooks
  const { formState, inputHandler } = useForm(
    {
      name: { value: "", isValid: false },
      ParentId: { value: "", isValid: false },
    },
    false
  );

  // custom functions
  const name = formState.inputs.name.value;
  const ParentId = +formState.inputs.ParentId.value;
  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsLoading(true);
      if (name && ParentId) {
        await fetch(process.env.REACT_APP_BACKEND_URL + `/api/v1/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name,
            ParentId,
          }),
        }).catch((err) => err);
      }
      setIsLoading(false);
      navigate(0);
    },
    [navigate, token, name, ParentId]
  );

  return (
    <form
      className="rounded-b bg-neutral-700 p-3 text-white shadow"
      onSubmit={submitHandler}
      onClick={(e) => {
        e.stopPropagation();
        if (isDrop) setIsDrop(false);
      }}
      onBlur={() => setIsDrop(false)}
    >
      <p className="pb-2 pl-1 pt-2 text-base font-bold">Name</p>
      <Input
        type="text"
        name="name"
        placeholder="Input category...."
        errorMessage={"Please enter Category!"}
        className="h-8 w-full rounded-sm border border-gray-500 pl-2 text-base text-black outline-none"
        onInput={inputHandler}
        validators={(e) => !validator.isEmpty(e)}
      />
      <p className="pl-1 pt-4 text-base font-bold">Parent</p>
      <AwaitWrapper resolve={relation}>
        {(response) => {
          const choices =
            response?.data?.categories?.data.map((el) => ({
              ...el,
              value: el.id,
            })) ?? [];

          return (
            <MultiSelectInput
              name="ParentId"
              defaultName="Top"
              choices={choices}
              choiceElement={<li className="list-none" />}
              defaultValue="This category belongs to..."
              isDrop={isDrop}
              onDrop={setIsDrop}
              onInput={inputHandler}
            />
          );
        }}
      </AwaitWrapper>
      <div className="mt-4 flex w-full justify-end pt-0.5">
        <Button
          type="submit"
          disabled={!formState.isValid || isLoading}
          loading={isLoading}
          spinner={{ size: 15 }}
          className="ml-1.5 rounded-lg bg-blue-700 p-2 text-xs font-bold text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300"
        >
          Create
        </Button>
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
