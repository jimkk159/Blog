import { useCallback, useRef, useState } from "react";
import * as authHelper from "../../../utils/auth";
import { AiFillCamera } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { ImNewspaper } from "react-icons/im";
import { json, redirect, useRouteLoaderData } from "react-router-dom";
import { BsFillKeyFill, BsPersonCircle } from "react-icons/bs";
import Avatar from "../../../components/UI/Avatar";
import Password from "../../../components/Profile/Password";
import EditProfile from "../../../components/Profile/EditProfile";
import ProfilePosts from "../../../components/Profile/ProfilePosts";
import { authActions } from "../../../store/auth-slice";
import Selection from "../../../components/UI/Selection";

function Profile() {
  const token = authHelper.getAuthToken();

  const inputRef = useRef(null);
  const [status, setStatus] = useState();
  const dispatch = useDispatch();
  const { author } = useRouteLoaderData("profile");

  const inputAvatarHandler = useCallback(() => inputRef.current.click(), []);

  const updateAvatarHander = useCallback(
    async (event) => {
      if (event.target.files && event.target.files.length === 1) {
        const avatar = event.target.files[0];

        const avatarForm = new FormData();
        avatarForm.append("avatar", avatar);

        const resoponse = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/api/v1/users/avatar",
          {
            method: "PATCH",
            headers: { Authorization: "Bearer " + token },
            body: avatarForm,
          }
        ).catch((err) => err);

        const currentAvatar = (await resoponse.json()).data.avatar;

        dispatch(authActions.updateAvatar({ avatar: currentAvatar }));

        window.location.reload();
      }
    },
    [dispatch, token]
  );

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="m-8 flex h-[800px] w-full max-w-4xl flex-row rounded-xl bg-green-600">
        <div className="flex h-full max-w-[300px] flex-col bg-green-400">
          <div className="h-1/3 rounded-2xl bg-red-900 p-2">
            <Avatar avatar={author.avatar} className="h-full w-full">
              <AiFillCamera
                className="absolute bottom-4 right-4 z-10 h-10 w-10 cursor-pointer bg-transparent text-gray-200 text-opacity-80"
                onClick={inputAvatarHandler}
              />
            </Avatar>
            <input
              ref={inputRef}
              style={{ display: "none" }}
              type="file"
              accept=".jpg,.png,.jpeg,.jfif,.gif"
              name="avatar"
              onChange={updateAvatarHander}
            />
          </div>
          <ul className="h-full w-full items-center justify-center rounded-2xl bg-gray-400 p-4">
            <Selection
              className="my-4 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500"
              text="About"
              onClick={() => setStatus(null)}
            >
              <BsPersonCircle className="h-[24px] w-[24px]" />
            </Selection>
            <Selection
              className="my-2 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500"
              text="Password"
              onClick={() => setStatus("auth")}
            >
              <BsFillKeyFill className="h-[24px] w-[24px]" />
            </Selection>
            <Selection
              className="my-4 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500"
              text="Posts"
              onClick={() => setStatus("posts")}
            >
              <ImNewspaper className="h-[24px] w-[24px]" />
            </Selection>
          </ul>
        </div>
        <div className="h-full w-2/3 bg-blue-800 px-12 py-10">
          {!status && <EditProfile author={author} />}
          {status === "auth" && <Password onCancel={() => setStatus(null)} />}
          {status === "posts" && <ProfilePosts />}
        </div>
      </div>
    </div>
  );
}

export default Profile;

export async function action({ request }) {
  const token = authHelper.getAuthToken();
  const data = await request.formData();
  const userData = {
    name: data.get("name"),
    description: data.get("description"),
  };

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/users/me`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok)
    return json(
      { message: `Something wrong happen when updating profile...` },
      { status: 500 }
    );

  return redirect("/");
}
