import { useState } from "react";
// import { useMediaQuery } from "react-responsive";
import { json, useRouteLoaderData } from "react-router-dom";

// icons
import { BsFillKeyFill } from "react-icons/bs";

// components
import Container from "../../../components/UI/Container";
import PinkButton from "../../../components/UI/PinkButton";
import Password from "../../../components/Profile/Password";
import PostList2 from "../../../components/Post/PostsList2";
import SectionTitle from "../../../components/Section/SectionTitle";
import ProfilePosts from "../../../components/Profile/ProfilePosts";
import EditProfileName from "../../../components/Profile/EditProfileName";
import EditProfileAvatar from "../../../components/Profile/EditProfileAvatar";
import EditProfilePassword from "../../../components/Profile/EditProfilePassword";
import EditProfileDescription from "../../../components/Profile/EditProfileDescription";

// helper
import * as authHelper from "../../../utils/auth";

function Profile() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState();
  const [isUpdatePassword, setIsUpdatePassword] = useState();

  // react-router
  const { author, posts } = useRouteLoaderData("profile");

  // import hooks
  // const matches768 = useMediaQuery({ query: "(min-width: 768px)" });
  // const matches1024 = useMediaQuery({ query: "(min-width: 1024x)" });

  // custom functions

  // if (matches1024)
  //   return (
  //     <div className="flex h-full w-full items-center justify-center p-8">
  //       <div className="m-8 flex h-[800px] w-full max-w-4xl flex-col rounded-xl bg-green-600">
  //         <div className="flex h-full w-full flex-row bg-green-400">
  //           <div className="flex h-full w-1/3 max-w-[300px] flex-col">
  //             <div className="flex items-center justify-center rounded-2xl bg-red-900 p-4">
  //               <Avatar2
  //                 className="h-44 w-44 border-2 border-white lg:h-52 lg:w-52"
  //                 avatar={author.avatar}
  //               >
  //                 <AiFillCamera
  //                   className="absolute bottom-4 right-4 z-10 h-10 w-10 cursor-pointer bg-transparent text-gray-200 text-opacity-80"
  //                   onClick={inputAvatarHandler}
  //                 />
  //               </Avatar2>
  //               <input
  //                 ref={inputRef}
  //                 style={{ display: "none" }}
  //                 type="file"
  //                 accept=".jpg,.png,.jpeg,.jfif,.gif"
  //                 name="avatar"
  //                 onChange={updateAvatarHander}
  //               />
  //             </div>
  //             <ul className="h-full w-full items-center justify-center rounded-2xl bg-gray-400 p-4">
  //               <Selection
  //                 className="my-4 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500 lg:space-x-5"
  //                 text="About"
  //                 onClick={() => setStatus(null)}
  //               >
  //                 <BsPersonCircle className="h-[36px] w-[36px] lg:h-[48px] lg:w-[48px]" />
  //               </Selection>
  //               <Selection
  //                 className="my-4 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500 lg:space-x-5"
  //                 text="Password"
  //                 onClick={() => setStatus("auth")}
  //               >
  //                 <BsFillKeyFill className="h-[36px] w-[36px] lg:h-[48px] lg:w-[48px]" />
  //               </Selection>
  //               <Selection
  //                 className="my-4 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-4 hover:bg-blue-500 lg:space-x-5"
  //                 text="Posts"
  //                 onClick={() => setStatus("posts")}
  //               >
  //                 <ImNewspaper className="h-[36px] w-[36px] lg:h-[48px] lg:w-[48px]" />
  //               </Selection>
  //             </ul>
  //           </div>
  //           <div className="h-full w-2/3 bg-blue-800 p-4">
  //             <div className="h-full w-full rounded-md border-2 border-white bg-pink-800 p-4">
  //               {!status && <EditProfile author={author} />}
  //               {status === "auth" && (
  //                 <Password onCancel={() => setStatus(null)} />
  //               )}
  //               {status === "posts" && <ProfilePosts />}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  // if (matches768)
  //   return (
  //     <div className="flex h-full w-full items-center justify-center p-8">
  //       <div className="m-8 flex h-[800px] w-full max-w-4xl flex-col rounded-xl bg-green-600">
  //         <div className="flex h-fit w-full bg-green-400">
  //           <div className="flex items-center justify-center rounded-2xl bg-red-900 p-2">
  //             <Avatar2
  //               className="h-32 w-32 border-2 border-white"
  //               avatar={author.avatar}
  //             >
  //               <AiFillCamera
  //                 className="absolute bottom-4 right-4 z-10 h-10 w-10 cursor-pointer bg-transparent text-gray-200 text-opacity-80"
  //                 onClick={inputAvatarHandler}
  //               />
  //             </Avatar2>
  //             <input
  //               ref={inputRef}
  //               style={{ display: "none" }}
  //               type="file"
  //               accept=".jpg,.png,.jpeg,.jfif,.gif"
  //               name="avatar"
  //               onChange={updateAvatarHander}
  //             />
  //           </div>
  //           <ul className="w-full items-center justify-center rounded-2xl bg-gray-400 px-4 py-2">
  //             <Selection
  //               className="my-2 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-2 hover:bg-blue-500"
  //               text="About"
  //               onClick={() => setStatus(null)}
  //             >
  //               <BsPersonCircle className="h-[24px] w-[24px]" />
  //             </Selection>
  //             <Selection
  //               className="my-2 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-2 hover:bg-blue-500"
  //               text="Password"
  //               onClick={() => setStatus("auth")}
  //             >
  //               <BsFillKeyFill className="h-[24px] w-[24px]" />
  //             </Selection>
  //             <Selection
  //               className="my-2 flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-blue-400 p-2 hover:bg-blue-500"
  //               text="Posts"
  //               onClick={() => setStatus("posts")}
  //             >
  //               <ImNewspaper className="h-[24px] w-[24px]" />
  //             </Selection>
  //           </ul>
  //         </div>
  //         <div className="h-full bg-blue-800 p-4">
  //           {!status && <EditProfile author={author} />}
  //           {status === "auth" && <Password onCancel={() => setStatus(null)} />}
  //           {status === "posts" && <ProfilePosts />}
  //         </div>
  //       </div>
  //     </div>
  //   );

  // custom functions
  const navPageHandler = (nextPage) => setPage(nextPage);

  return (
    <Container>
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full items-center justify-center rounded-xl bg-self-dark-gray p-6 lg:max-w-3xl">
          <div className="flex h-full w-full flex-col rounded-xl bg-self-dark p-8 text-white lg:w-[640px] ">
            <div className="flex w-full items-center justify-center rounded-2xl py-4">
              <EditProfileAvatar defaultValue={author.avatar} />
            </div>
            <div className="flex w-full items-center justify-start space-x-4">
              <div className="h-8 w-[calc(50%-90px)]" />
              <EditProfileName defaultValue={author.name} />
              <PinkButton
                className="px-4 py-2"
                onClick={() => setIsUpdatePassword((prev) => !prev)}
              >
                <div className="flex items-center justify-center space-x-0.5">
                  <BsFillKeyFill className="h-[20px] w-[20px]" />
                  <p className="text-xs">Password</p>
                </div>
              </PinkButton>
            </div>
            {isUpdatePassword && (
              <div className="mt-2">
                <EditProfilePassword
                  onCancel={() => setIsUpdatePassword(false)}
                  onConfirm={() => setIsUpdatePassword(false)}
                />
              </div>
            )}
            {!isUpdatePassword && (
              <>
                <div className="mb-4 mt-4 flex h-40 flex-col items-center justify-center space-y-2 border border-self-gray bg-yellow-700 bg-opacity-20 p-2">
                  <EditProfileDescription defaultValue={author.description} />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <SectionTitle first={"My Posts"} second={"Library"} />
                </div>
                <PostList2
                  size="small"
                  page={page}
                  posts={posts.data}
                  total={posts.total}
                  onNavPage={navPageHandler}
                />
              </>
            )}
            <>
              {/* {!status && <EditProfile author={author} />} */}
              {status === "auth" && (
                <Password onCancel={() => setStatus(null)} />
              )}
              {status === "posts" && <ProfilePosts />}
            </>
          </div>
        </div>
      </div>
    </Container>
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
