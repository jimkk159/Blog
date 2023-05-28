import { Form, redirect } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Form
        method="post"
        className="flex w-[448px] flex-col justify-center rounded-lg bg-white p-12 text-black"
      >
        <p className="text-center text-3xl font-bold">
          Forgot yuour password?
        </p>
        <p className="mt-16 pl-[4px] font-bree-serif text-base">{`We will send the new password to your email address!`}</p>
        <label
          htmlFor="email"
          className="text-sm mt-12"
        >{`Please enter your email.`}</label>
        <input
          type="email"
          name="email"
          required
          className="m-0 my-1.5 box-border h-12 overflow-ellipsis rounded border border-gray-400 px-2 py-2.5 text-base focus:outline-gray-400"
          placeholder="Email"
        />
        <button
          type="submit"
          className="m-0 my-1.5 box-border h-12 rounded border bg-blue-500 px-2 py-2.5 text-center font-roboto text-lg text-white"
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
