import { Form, useNavigation } from "react-router-dom";

import Input from "../UI/Input";
import useForm from "../../hooks/form-hook";
import Button from "../UI/Button";
import { useMediaQuery } from "react-responsive";

function Password({ onCancel }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { formState, inputHandler } = useForm(
    {
      password: { value: "", isValid: false },
      newPassword: { value: "", isValid: false },
      confirmNewPassword: { value: "", isValid: false },
    },
    false
  );

  const matches = useMediaQuery({ query: "(min-width: 480px)" });
  if (!matches)
    return (
      <Form
        method="post"
        action="/update_password"
        className="flex flex-col items-start justify-start space-y-4 bg-purple-700"
      >
        <div className="flex w-full flex-col items-start justify-start space-y-4 p-4">
          <div className="flex w-full flex-col space-y-0.5">
            <label htmlFor="password" className="font-roboto text-base">
              Old password
            </label>
            <Input
              type="password"
              name="password"
              className="h-8 w-40 rounded pl-2 font-kanit text-black outline-none"
              errorMessage={"Please enter at least 6 characters."}
              onInput={inputHandler}
              validators={(e) => e.length >= 6}
            />
          </div>
          <div className="flex w-full flex-col space-y-0.5">
            <label htmlFor="newPassword" className="font-roboto text-base">
              Password
            </label>
            <Input
              type="password"
              name="newPassword"
              className="h-8 w-40 rounded pl-2 font-kanit text-black outline-none"
              errorMessage={"Please enter at least 6 characters."}
              onInput={inputHandler}
              validators={(e) => e.length >= 6}
            />
          </div>
          <div className="flex w-full flex-col space-y-0.5">
            <label
              htmlFor="confirmNewPassword"
              className="font-roboto text-base"
            >
              Password again
            </label>
            <Input
              type="password"
              name="confirmNewPassword"
              className="h-8 w-40 rounded pl-2 font-kanit text-black outline-none"
              errorMessage={"Please enter the same password."}
              onInput={inputHandler}
              validators={(e) => e === formState.inputs.newPassword}
            />
          </div>
        </div>
        <div className="flex w-full flex-row">
          <Button
            disabled={!formState.isValid || isSubmitting}
            loading={isSubmitting}
            type="submit"
            className="box-border w-1/2 rounded border-[1px] bg-transparent px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300"
          >
            Confrim
          </Button>
          <Button
            type="button"
            loading={isSubmitting}
            className="box-border w-1/2 rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
    );

  return (
    <Form
      method="post"
      action="/update_password"
      className="flex flex-col items-start justify-start space-y-4 bg-purple-700 p-4"
    >
      <div className="flex w-full flex-col items-start justify-start space-y-4">
        <div className="flex w-full flex-col space-y-0.5 lg:space-y-2">
          <label
            htmlFor="password"
            className="font-roboto text-base lg:text-2xl"
          >
            Old password
          </label>
          <Input
            type="password"
            name="password"
            className="h-8 w-40 rounded pl-2 font-kanit text-black outline-none lg:h-10 lg:w-52 lg:text-2xl"
            errorMessage={"Please enter at least 6 characters."}
            onInput={inputHandler}
            validators={(e) => e.length >= 6}
          />
        </div>
        <div className="flex w-full flex-col space-y-0.5">
          <label
            htmlFor="newPassword"
            className="font-roboto text-base lg:text-2xl"
          >
            Password
          </label>
          <Input
            type="password"
            name="newPassword"
            className="h-8 w-40 rounded pl-2 font-kanit text-black outline-none lg:h-10 lg:w-52 lg:text-2xl"
            errorMessage={"Please enter at least 6 characters."}
            onInput={inputHandler}
            validators={(e) => e.length >= 6}
          />
        </div>
        <div className="flex w-full flex-col space-y-0.5">
          <label
            htmlFor="confirmNewPassword"
            className="font-roboto text-base lg:text-2xl"
          >
            Password again
          </label>
          <Input
            type="password"
            name="confirmNewPassword"
            className="h-8 w-40 rounded pl-2 font-kanit text-black outline-none lg:h-10 lg:w-52 lg:text-2xl"
            errorMessage={"Please enter the same password."}
            onInput={inputHandler}
            validators={(e) => e === formState.inputs.newPassword}
          />
        </div>
      </div>
      <div className="flex w-full items-end justify-end space-x-4 pb-4 pt-8">
        <Button
          disabled={!formState.isValid || isSubmitting}
          loading={isSubmitting}
          type="submit"
          className="box-border rounded border-[1px] bg-transparent px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300 lg:px-8 lg:py-2 lg:text-2xl"
        >
          Confrim
        </Button>
        <Button
          type="button"
          loading={isSubmitting}
          className="box-border rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 lg:px-8 lg:py-2 lg:text-2xl"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default Password;
