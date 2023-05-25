import Avatar from "../../components/UI/Avatar";
import { useRouteLoaderData } from "react-router-dom";
import ProfilePosts from "../../components/Profile/ProfilePosts";

function BrowserProfile() {
  const { author } = useRouteLoaderData("profile");
  
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
          <div className="flex justify-start">
            <div className="w-[200px] bg-pink-500">
              <div className="rounded-2xl bg-red-900 p-4">
                <div className="relative">
                  <Avatar avatar={author.avatar} />
                </div>
              </div>
              <p className="bg-violet-600 p-4 font-source-serif-pro text-2xl italic">
                {author.name}
              </p>
            </div>
          </div>
          <p className="h-full p-4 text-justify font-pt-serif">
            {author.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BrowserProfile;
