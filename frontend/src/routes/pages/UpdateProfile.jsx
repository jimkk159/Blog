import { Form, Link, redirect, useRouteLoaderData } from "react-router-dom";
import * as authHelper from "../../util/auth";

function UpdateProfile() {
  const { author } = useRouteLoaderData("profile");

  return (
    <>
      <Form method="patch">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={author ? author.name : null}
        />
        <label htmlFor="avatar">Avatar</label>
        <input
          type="text"
          id="avatar"
          name="avatar"
          defaultValue={author ? author.avatar : null}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          defaultValue={author ? author.description : null}
        />
        <button>Save</button>
      </Form>
      <Link to="/profile">Cancel</Link>
      <Link to="/update_password">Update Password</Link>
    </>
  );
}

export default UpdateProfile;

export async function action({ request }) {
  const token = authHelper.getAuthToken();
  const data = await request.formData();
  const userData = {
    name: data.get("name"),
    avatar: data.get("avatar"),
    description: data.get("description"),
  };

  await fetch(process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(userData),
  });

  return redirect("/profile");
}
