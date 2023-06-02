import { useState } from "react";
import validator from "validator";
import { Form } from "react-router-dom";

import Input from "../UI/Input";
import useForm from "../../hooks/form-hook";

function EditProfile({ author }) {
  const [isEdit, setIsEdit] = useState(false);
  const { formState, inputHandler } = useForm(
    { name: { value: "", isValid: false } },
    false
  );

  return (
    <Form
      method="post"
      className="flex h-full w-full flex-col space-y-4 bg-orange-500"
    >
      <h1 className="mb-4 text-3xl">Profile</h1>
      {isEdit && (
        <div className="flex flex-col space-y-1">
          <label htmlFor="name">NAME</label>
          <Input
            type="text"
            name="name"
            className="h-8 w-48 rounded text-black outline-none"
            errorMessage={"Please enter your name."}
            defaultValue={author.name}
            onInput={inputHandler}
            validators={(e) => !validator.isEmpty(e)}
          />
        </div>
      )}
      {isEdit && (
        <div className="flex h-1/2 flex-col space-y-1 ">
          <label htmlFor="description" className="mt-4">
            Introduction
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={author.description}
            className="mt-2 h-full resize-none rounded-lg text-black outline-none"
          />
        </div>
      )}
      {!isEdit && (
        <>
          <div className="flex flex-row">
            <h1 className="first-letter:float-top font-dela-gothic-one first-letter:text-4xl first-letter:font-bold first-letter:text-white first-line:tracking-widest">
              Hi, <span className="font-kanit">I am {author.name}</span>
            </h1>
          </div>
          <p className="mt-2 text-justify text-base">{author.description}</p>
        </>
      )}
      <div className="flex justify-end space-x-4 py-4 pr-4">
        {!isEdit && (
          <button
            type="button"
            className="box-border rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
        {isEdit && (
          <>
            <button
              type="submit"
              disabled={!formState.isValid}
              className="box-border rounded border-[1px] bg-transparent px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300"
            >
              Save
            </button>
            <button
              type="button"
              className="box-border rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700"
              onClick={() => setIsEdit(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </Form>
  );
}

export default EditProfile;
