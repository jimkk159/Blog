import { Form, Link, redirect } from "react-router-dom";
import * as authHelper from "../../utils/auth";

function UpdatePassword() {
  return (
    <>
      <Form method="post">
        <label htmlFor="password">old password</label>
        <input id="password" type="text" name="password" />
        <label htmlFor="newPassword">new password</label>
        <input id="newPassword" type="text" name="newPassword" />
        <label htmlFor="confirmNewPassword">confirm new password</label>
        <input id="confirmNewPassword" type="text" name="confirmNewPassword" />
        <button>Save</button>
      </Form>
      <Link to="/profile">Cancel</Link>
    </>
  );
}

export default UpdatePassword;

export async function action({ request }) {
  const data = await request.formData();
  const token = authHelper.getAuthToken();

  const authData = {
    password: data.get("password"),
    newPassword: data.get("newPassword"),
    confirmNewPassword: data.get("confirmNewPassword"),
  };

  await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/auth/updatePassword",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(authData),
    }
  );
  return redirect("/");
}
