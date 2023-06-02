import { Form } from "react-router-dom";

import Input from "../UI/Input";
import useForm from "../../hooks/form-hook";

function Password({ onCancel }) {
  const { formState, inputHandler } = useForm(
    {
      password: { value: "", isValid: false },
      newPassword: { value: "", isValid: false },
      confirmNewPassword: { value: "", isValid: false },
    },
    false
  );
  
  return (
    <Form
      method="post"
      action="/update_password"
      className="flex h-full w-full flex-col space-y-4 bg-orange-500 "
    >
      <div className="flex flex-col space-y-1">
        <label htmlFor="password">Old password</label>
        <Input
          type="password"
          name="password"
          className="h-8 w-48 rounded px-2 text-black outline-none"
          errorMessage={"Please enter at least 6 characters."}
          onInput={inputHandler}
          validators={(e) => e.length >= 6}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="newPassword">Password</label>
        <Input
          type="newPassword"
          name="newPassword"
          className="h-8 w-48 rounded px-2 text-black outline-none"
          errorMessage={"Please enter at least 6 characters."}
          onInput={inputHandler}
          validators={(e) => e.length >= 6}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="confirmNewPassword">Password again</label>
        <Input
          type="confirmNewPassword"
          name="confirmNewPassword"
          className="h-8 w-48 rounded px-2 text-black outline-none"
          errorMessage={"Please enter at least 6 characters."}
          onInput={inputHandler}
          validators={(e) => e.length >= 6}
        />
      </div>
      <div className="flex justify-end space-x-4 py-4 pr-4">
        <button
          disabled={!formState.isValid}
          type="submit"
          className="box-border rounded border-[1px] bg-transparent px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300 "
        >
          Confrim
        </button>
        <button
          type="button"
          className="box-border rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}

export default Password;
