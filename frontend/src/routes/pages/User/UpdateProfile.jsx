import { AiFillCamera } from "react-icons/ai";
import {
  Form,
  Link,
  redirect,
  useSubmit,
  useRouteLoaderData,
} from "react-router-dom";
import { useRef, useCallback, useState } from "react";
import * as authHelper from "../../../utils/auth";

function UpdateProfile() {
  const inputRef = useRef(null);

  const submit = useSubmit();
  const { author } = useRouteLoaderData("profile");

  const [avatar, setAvatar] = useState();
  const [avatarUrl, setAvatarUrl] = useState(author.avatar);

  const pickHandler = () => inputRef.current.click();

  const inputImageHandler = useCallback(async (event) => {
    if (event.target.files && event.target.files.length === 1) {
      setAvatar(event.target.files[0]);
      const fileReader = new FileReader();
      fileReader.onload = () => setAvatarUrl(fileReader.result);
      fileReader.readAsDataURL(event.target.files[0]);
    }
  }, []);

  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      const token = authHelper.getAuthToken();
      // Submit  file data
      const avatarData = new FormData();
      avatarData.append("avatar", avatar);

      await fetch(
        process.env.REACT_APP_BACKEND_URL + `/api/v1/users/avatar`,
        {
          method: "PATCH",
          headers: { Authorization: "Bearer " + token },
          body: avatarData,
        }
      ).catch((err) => err);

      // Submit not file data
      const formData = new FormData();
      formData.append("name", event.target.name.value);
      formData.append("description", event.target.description.value);
      submit(formData, { method: "post", action: "/profile/update" });
    },
    [avatar, submit]
  );

  return (
    <>
      <Form method="patch" onSubmit={submitHandler}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={author ? author.name : null}
        />
        <label htmlFor="avatar">Avatar</label>
        <img src={avatarUrl} alt="avatar" />
        <input
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
          accept=".jpg,.png,.jpeg,.jfif,.gif"
          name="avatar"
          onChange={inputImageHandler}
        />
        <AiFillCamera onClick={pickHandler} />
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

export async function loader(){
  return redirect("/profile")
}
