import { defer, useLoaderData } from "react-router-dom";

// components
import Avatar from "../../../components/UI/Avatar";
import ProfilePosts from "../../../components/Profile/ProfilePosts";
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";

function BrowserProfile() {
  const { author } = useLoaderData();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="m-8 flex h-[800px] w-full max-w-4xl flex-row rounded-xl bg-green-600">
        <div className="h-full w-2/3 bg-blue-800 px-12 py-10">
          <h1 className="py-2 pl-2 font-bree-serif text-xl font-bold">
            Posts List
          </h1>
          <ProfilePosts />
        </div>
        <div className="flex h-full w-1/3 max-w-[300px] flex-col bg-teal-600">
          <AwaitWrapper resolve={author}>
            {(response) => (
              <>
                <div className="flex justify-start">
                  <div className="w-[200px] bg-pink-500">
                    <div className="rounded-2xl bg-red-900 p-4">
                      <Avatar
                        avatar={response?.data?.avatar}
                        className="h-40 w-40"
                      />
                    </div>
                    <p className="bg-violet-600 p-4 font-source-serif-pro text-2xl italic">
                      {response?.data?.name}
                    </p>
                  </div>
                </div>
                <p className="h-full p-4 text-justify font-pt-serif">
                  {response?.data?.description}
                </p>
              </>
            )}
          </AwaitWrapper>
        </div>
      </div>
    </div>
  );
}

export default BrowserProfile;

async function authorLoader(uid) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/users/${uid}`
  );
  if (!response.ok) throw new Error();

  return response.json();
}

async function postsLoader(uid) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/search?mode=author&type=id&target=${uid}`
  );
  if (!response.ok)
    return {
      data: [],
      total: 0,
    };

  return response.json();
}

export async function loader({ params }) {
  return defer({
    author: authorLoader(params.id),
    posts: postsLoader(params.id),
  });
}
