import validator from "validator";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Form, useActionData, useNavigation } from "react-router-dom";

// components
import Input from "../UI/Input";
import Button from "../UI/Button";

// hooks
import useForm from "../../hooks/form-hook";

function EditProfile({ author }) {
  const [isEdit, setIsEdit] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // react-router
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // import hooks
  const matches = useMediaQuery({ query: "(min-width: 480px)" });

  // custom hooks
  const { formState, inputHandler } = useForm(
    { name: { value: "", isValid: false } },
    false
  );

  // useEffect
  useEffect(() => {
    if (data && data.status === 200) {
      setIsEdit(false);
      setIsTouched(false);
    } else if (data) {
      setIsTouched(false);
      setSubmigErrorMessage(data.message);
    }
  }, [data]);

  if (!matches)
    return (
      <>
        {!isEdit && (
          <>
            <div className="flex flex-col items-center justify-center space-y-2 bg-yellow-700 p-4">
              <label
                htmlFor="description"
                className="font-bree-serif text-base"
              >
                Introduction
              </label>
              <p className="h-full w-full resize-none rounded-lg text-justify font-kanit text-xs text-white outline-none">
                {author.description}
              </p>
            </div>
            <button
              type="button"
              className="box-border rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg font-bold text-white shadow-md hover:bg-blue-700"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          </>
        )}
        {isEdit && (
          <Form
            method="post"
            className="flex h-full flex-col items-center justify-start space-y-4 bg-orange-700"
          >
            <div className="flex h-full w-full flex-col items-start justify-center space-y-4 p-4">
              <div className="flex w-full flex-col space-y-0.5">
                <label htmlFor="name" className="font-roboto text-base">
                  NAME
                </label>
                <Input
                  type="text"
                  name="name"
                  className="h-8 w-32 rounded pl-2 font-kanit text-black outline-none"
                  errorMessage={"Please enter your name."}
                  defaultValue={author.name}
                  onInput={inputHandler}
                  onFocus={() => setIsTouched(true)}
                  validators={(e) => !validator.isEmpty(e)}
                />
              </div>
              <div className="flex h-full w-full flex-col space-y-0.5">
                <label htmlFor="description" className="font-roboto text-base">
                  Introduction
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={author.description}
                  className="mt-2 h-full resize-none rounded-lg p-4 text-justify font-kanit text-sm text-black outline-none"
                  onFocus={() => setIsTouched(true)}
                />
              </div>
            </div>
            {isEdit && !isTouched && submigErrorMessage && (
              <p className="mb-4 text-left font-kanit text-self-red ">
                {submigErrorMessage}
              </p>
            )}
            <div className="flex w-full flex-row">
              <Button
                type="submit"
                disabled={!formState.isValid || isSubmitting}
                loading={isSubmitting}
                className="box-border w-1/2 rounded border-[1px] bg-transparent px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300"
              >
                Save
              </Button>
              <button
                type="button"
                className="box-border w-1/2 rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </>
    );

  return (
    <>
      <div className="flex h-full w-full flex-col space-y-4 bg-slate-600">
        {isEdit && (
          <Form
            method="post"
            className="flex h-full flex-col items-center justify-start space-y-4 bg-pink-700"
          >
            <div className="flex h-full w-full flex-col items-start justify-center space-y-4 p-4">
              <div className="flex w-full flex-col space-y-0.5 lg:space-y-2">
                <label
                  htmlFor="name"
                  className="font-roboto text-base lg:text-2xl"
                >
                  NAME
                </label>
                <Input
                  type="text"
                  name="name"
                  className="h-8 w-32 rounded pl-2 font-kanit text-black outline-none lg:h-10 lg:w-48 lg:text-2xl"
                  errorMessage={"Please enter your name."}
                  defaultValue={author.name}
                  onInput={inputHandler}
                  onFocus={() => setIsTouched(true)}
                  validators={(e) => !validator.isEmpty(e)}
                />
              </div>
              <div className="flex h-full w-full flex-col space-y-0.5 lg:space-y-2">
                <label
                  htmlFor="description"
                  className="font-roboto text-base lg:text-2xl"
                >
                  Introduction
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={author.description}
                  className="mt-2 h-full resize-none rounded-lg p-4 text-justify font-kanit text-sm text-black outline-none md:text-base lg:text-lg"
                  onFocus={() => setIsTouched(true)}
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-end justify-end py-4 pr-4">
              {!isTouched && submigErrorMessage && (
                <p className="mb-4 text-left font-kanit text-self-red ">
                  {submigErrorMessage}
                </p>
              )}
              <div className="flex w-full items-end justify-end space-x-4">
                <Button
                  type="submit"
                  disabled={!formState.isValid || isSubmitting}
                  loading={isSubmitting}
                  className="box-border rounded border-[1px] bg-transparent px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300 lg:px-8 lg:py-2 lg:text-2xl"
                >
                  Save
                </Button>
                <button
                  type="button"
                  className="box-border rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 lg:px-8 lg:py-2 lg:text-2xl"
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
        {!isEdit && (
          <>
            <div className="flex h-fit w-full flex-col items-center justify-center bg-green-500 p-4">
              <h1 className="font-bree-serif text-3xl lg:text-5xl">
                Introduction
              </h1>
            </div>
            <p className="h-fit w-full resize-none rounded-lg p-4 text-justify font-kanit text-base text-white outline-none lg:text-lg">
              {author.description}
            </p>
            <div className="flex flex-col py-4 pr-4">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="box-border rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 lg:px-8 lg:py-2 lg:text-2xl"
                  onClick={() => setIsEdit(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default EditProfile;
