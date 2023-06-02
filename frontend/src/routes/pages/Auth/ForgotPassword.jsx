import validator from "validator";
import { Form, redirect } from "react-router-dom";

import Input from "../../../components/UI/Input";
import useForm from "../../../hooks/form-hook";

function ForgotPassword() {
  const { formState, inputHandler } = useForm(
    { email: { value: "", isValid: false } },
    false
  );

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Form
        method="post"
        className="flex w-[448px] flex-col justify-center rounded-lg bg-white p-12 text-black"
      >
        <p className="text-center text-3xl font-bold">Forgot yuour password?</p>
        <p className="mt-16 pl-[4px] font-bree-serif text-base">{`We will send the new password to your email address!`}</p>
        <label
          htmlFor="email"
          className="mt-12 text-sm"
        >{`Please enter your email.`}</label>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          errorMessage={"Please enter a valid email."}
          onInput={inputHandler}
          validators={validator.isEmail}
        />
        <button
          type="submit"
          disabled={!formState.isValid}
          className="m-0 my-1.5 box-border h-12 rounded border bg-blue-500 px-2 py-2.5 text-center font-roboto text-lg text-white disabled:bg-blue-300"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}

export default ForgotPassword;

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
  };
  await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/auth/forgotPassword",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    }
  );
  return redirect("/");
}
