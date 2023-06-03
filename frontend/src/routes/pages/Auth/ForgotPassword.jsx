import validator from "validator";
import {
  json,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";

import Input from "../../../components/UI/Input";
import useForm from "../../../hooks/form-hook";
import Button from "../../../components/UI/Button";
import { useState, useEffect } from "react";

function ForgotPassword() {
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const data = useActionData();

  useEffect(() => {
    if (data && data.message) {
      setSubmigErrorMessage(data.message);
    }
  }, [data]);

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
        <p
          className={`mt-16 pl-[4px] font-bree-serif text-base ${
            submigErrorMessage ? " mb-5" : " mb-12"
          }`}
        >{`We will send the new password to your email address!`}</p>
        {submigErrorMessage && (
          <p className="mb-5 text-center text-[#FF0000] ">
            {submigErrorMessage}
          </p>
        )}
        <label
          htmlFor="email"
          className="text-sm"
        >{`Please enter your email.`}</label>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="m-0 my-1.5 box-border h-12 w-full overflow-ellipsis rounded border border-gray-400 bg-[#f8f8f8] px-2 py-2.5 text-base outline-none focus:border-[#510077] focus:bg-[#ebebeb]"
          errorMessage={"Please enter a valid email."}
          onInput={inputHandler}
          validators={validator.isEmail}
        />
        <Button
          type="submit"
          disabled={!formState.isValid || isSubmitting}
          loading={isSubmitting}
          className="m-0 my-1.5 box-border h-12 rounded border bg-blue-500 px-2 py-2.5 text-center font-roboto text-lg text-white disabled:bg-blue-300"
        >
          Submit
        </Button>
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
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/auth/forgotPassword",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    }
  );
  switch (response.status) {
    case 403:
      return json({ message: "Email does not exist" }, { status: 403 });
    default:
      return redirect("/");
  }
}
