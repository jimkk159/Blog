import { useState } from "react";
import { defer, useLoaderData } from "react-router-dom";
// import { useMediaQuery } from "react-responsive";

// icons
import { BsFillKeyFill } from "react-icons/bs";

// components
import Container from "../../../components/UI/Container";
import PinkButton from "../../../components/UI/PinkButton";
import PostList2 from "../../../components/Post/PostsList2";
import SectionTitle from "../../../components/Section/SectionTitle";
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";
import EditProfileName from "../../../components/Profile/EditProfileName";
import EditProfileAvatar from "../../../components/Profile/EditProfileAvatar";
import EditProfilePassword from "../../../components/Profile/EditProfilePassword";
import EditProfileDescription from "../../../components/Profile/EditProfileDescription";

// helper
import * as authHelper from "../../../utils/auth";

function Profile() {
  const [page, setPage] = useState(1);
  const [isUpdatePassword, setIsUpdatePassword] = useState();

  // react-router
  const { author, posts } = useLoaderData();

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
              <AwaitWrapper resolve={author}>
                {(response) => (
                  <EditProfileAvatar defaultValue={response?.data?.avatar} />
                )}
              </AwaitWrapper>
            </div>
            <div className="flex w-full items-center justify-start space-x-4">
              <div className="h-8 w-[calc(50%-90px)]" />
              <AwaitWrapper resolve={author}>
                {(response) => (
                  <>
                    <EditProfileName defaultValue={response.data.name} />
                    <PinkButton
                      className="px-4 py-2"
                      onClick={() => setIsUpdatePassword((prev) => !prev)}
                    >
                      <div className="flex items-center justify-center space-x-0.5">
                        <BsFillKeyFill className="h-[20px] w-[20px]" />
                        <p className="text-xs">Password</p>
                      </div>
                    </PinkButton>
                  </>
                )}
              </AwaitWrapper>
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
                  <AwaitWrapper resolve={author}>
                    {(response) => (
                      <EditProfileDescription
                        defaultValue={response?.data?.description}
                      />
                    )}
                  </AwaitWrapper>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <SectionTitle first={"My Posts"} second={"Library"} />
                </div>
                <AwaitWrapper resolve={posts}>
                  {(response) => (
                    <PostList2
                      size="small"
                      page={page}
                      posts={response.data ?? []}
                      total={response?.total}
                      onNavPage={navPageHandler}
                    />
                  )}
                </AwaitWrapper>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Profile;

async function myAuthorLoader() {
  const token = authHelper.getAuthToken();

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/users/me`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) throw new Error();

  return response.json();
}

async function myPostsLoader() {
  const token = authHelper.getAuthToken();

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/me?fields=updatedAt,-content,-AuthorId&all=1`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok)
    return {
      data: [],
      total: 0,
    };

  return response.json();
}

export async function loader({}) {
  return defer({
    author: myAuthorLoader(),
    posts: myPostsLoader(),
  });
}
