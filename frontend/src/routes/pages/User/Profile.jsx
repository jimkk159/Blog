import { useDispatch } from "react-redux";
import { ImNewspaper } from "react-icons/im";
import { AiFillCamera } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";
import { useCallback, useRef, useState } from "react";
import { json, useRouteLoaderData } from "react-router-dom";
import { BsFillKeyFill, BsPersonCircle } from "react-icons/bs";

// components
import Avatar from "../../../components/UI/Avatar";
import { authActions } from "../../../store/auth-slice";
import Selection from "../../../components/UI/Selection";
import Password from "../../../components/Profile/Password";
import EditProfile from "../../../components/Profile/EditProfile";
import ProfilePosts from "../../../components/Profile/ProfilePosts";

// helper
import * as authHelper from "../../../utils/auth";

function Profile() {
  const token = authHelper.getAuthToken();

  const inputRef = useRef(null);
  const [status, setStatus] = useState();

  // redux
  const dispatch = useDispatch();
  const { author } = useRouteLoaderData("profile");

  // import hooks
  const matches480 = useMediaQuery({ query: "(min-width: 480px)" });
  const matches768 = useMediaQuery({ query: "(min-width: 768px)" });

  // custom functions
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

  if (!matches480)
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="flex h-[800px] w-full max-w-4xl  flex-col rounded-xl bg-green-600">
          <div className="flex w-full items-center justify-center rounded-2xl bg-red-900 py-4">
            <Avatar
              avatar={author.avatar}
              className="m-auto h-32 w-32 border-2 border-white"
            >
              <AiFillCamera
                className="absolute bottom-3 right-3 z-10 h-8 w-8 cursor-pointer bg-transparent text-gray-200 text-opacity-80"
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
          <h1 className="-mt-4 flex w-full items-center justify-center bg-blue-900 bg-transparent font-kanit text-2xl font-bold">
            {author.name}
          </h1>
          <ul className="flex w-full flex-row items-center justify-center space-x-2 rounded-2xl bg-gray-400 p-2 px-4">
            <Selection
              className="flex w-full cursor-pointer items-center space-x-2 rounded-lg bg-blue-400 p-2 font-bold hover:bg-blue-500"
              text="About"
              onClick={() => setStatus(null)}
            >
              <BsPersonCircle className="h-[22px] w-[22px]" />
            </Selection>
            <Selection
              className="flex w-full cursor-pointer items-center space-x-2 rounded-lg bg-blue-400 p-2 font-bold hover:bg-blue-500"
              text="Password"
              onClick={() => setStatus("auth")}
            >
              <BsFillKeyFill className="h-[28px] w-[28px]" />
            </Selection>
            <Selection
              className="flex w-full cursor-pointer items-center space-x-2 rounded-lg bg-blue-400 p-2 font-bold hover:bg-blue-500"
              text="Posts"
              onClick={() => setStatus("posts")}
            >
              <ImNewspaper className="h-[24px] w-[24px]" />
            </Selection>
          </ul>
          <>
            {!status && <EditProfile author={author} />}
            {status === "auth" && <Password onCancel={() => setStatus(null)} />}
            {status === "posts" && <ProfilePosts />}
          </>
        </div>
      </div>
    );

  if (!matches768)
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="m-8 flex h-[800px] w-full max-w-4xl flex-col rounded-xl bg-green-600">
          <div className="flex h-fit w-full bg-green-400">
            <div className="flex items-center justify-center rounded-2xl bg-red-900 p-2">
              <Avatar
                className="h-32 w-32 border-2 border-white"
                avatar={author.avatar}
              >
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
            <ul className="w-full items-center justify-center rounded-2xl bg-gray-400 px-4 py-2">
              <Selection
                className="my-2 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-2 hover:bg-blue-500"
                text="About"
                onClick={() => setStatus(null)}
              >
                <BsPersonCircle className="h-[24px] w-[24px]" />
              </Selection>
              <Selection
                className="my-2 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-2 hover:bg-blue-500"
                text="Password"
                onClick={() => setStatus("auth")}
              >
                <BsFillKeyFill className="h-[24px] w-[24px]" />
              </Selection>
              <Selection
                className="my-2 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-2 hover:bg-blue-500"
                text="Posts"
                onClick={() => setStatus("posts")}
              >
                <ImNewspaper className="h-[24px] w-[24px]" />
              </Selection>
            </ul>
          </div>
          <div className="h-full bg-blue-800 p-4">
            {!status && <EditProfile author={author} />}
            {status === "auth" && <Password onCancel={() => setStatus(null)} />}
            {status === "posts" && <ProfilePosts />}
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="m-8 flex h-[800px] w-full max-w-4xl flex-col rounded-xl bg-green-600">
        <div className="flex h-full w-full flex-row bg-green-400">
          <div className="flex h-full w-1/3 max-w-[300px] flex-col">
            <div className="flex items-center justify-center rounded-2xl bg-red-900 p-4">
              <Avatar
                className="h-44 w-44 border-2 border-white lg:h-52 lg:w-52"
                avatar={author.avatar}
              >
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
                className="my-4 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500 lg:space-x-5"
                text="About"
                onClick={() => setStatus(null)}
              >
                <BsPersonCircle className="h-[36px] w-[36px] lg:h-[48px] lg:w-[48px]" />
              </Selection>
              <Selection
                className="my-4 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500 lg:space-x-5"
                text="Password"
                onClick={() => setStatus("auth")}
              >
                <BsFillKeyFill className="h-[36px] w-[36px] lg:h-[48px] lg:w-[48px]" />
              </Selection>
              <Selection
                className="my-4 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500 lg:space-x-5"
                text="Posts"
                onClick={() => setStatus("posts")}
              >
                <ImNewspaper className="h-[36px] w-[36px] lg:h-[48px] lg:w-[48px]" />
              </Selection>
            </ul>
          </div>
          <div className="h-full w-2/3 bg-blue-800 p-4">
            <div className="h-full w-full rounded-md border-2 border-white bg-pink-800 p-4">
              {!status && <EditProfile author={author} />}
              {status === "auth" && (
                <Password onCancel={() => setStatus(null)} />
              )}
              {status === "posts" && <ProfilePosts />}
            </div>
          </div>
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
      {
        status: 500,
        message: `Something wrong happen when updating profile...`,
      },
      { status: 500 }
    );

  return json(
    { status: 200, message: "Update successfully!" },
    { status: 200 }
  );
}
