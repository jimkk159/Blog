import { Form, redirect } from "react-router-dom";

function ForgotPassword() {
  return (
    <Form method="post">
      <label htmlFor="email">Email</label>
      <input id="email" type="text" name="email" />
      <button>Submit</button>
    </Form>
  );
}

export default ForgotPassword;

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
  };
  await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/auth/forgotPassword",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    }
  );
  return redirect("/")
}
