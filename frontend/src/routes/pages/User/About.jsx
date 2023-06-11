import { useSelector } from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import * as helper from "../../../utils/helper";
import { AwaitWrapper } from "../../helper/Wrapper";
import { json, defer, useNavigate, useRouteLoaderData } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  const { about } = useRouteLoaderData("about");
  const auth = useSelector((state) => state.auth);

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] w-full justify-center px-4 py-12 md:px-8">
      <div className="relative flex h-full w-full max-w-3xl flex-col justify-between rounded bg-white p-6 text-black md:p-16">
        <AwaitWrapper resolve={about}>
          {(about) => {
            let input = null;
            if (about[0] && about[0].content) input = about[0].content;
            return (
              <>
                <MDEditor.Markdown source={input} />
                <div className="h-full w-full"></div>
                <div className="my-8 flex flex-col">
                  <div className="flex justify-end font-pt-serif ">
                    {helper.hasPermissionToAbout(auth) && (
                      <button
                        type="submit"
                        className="ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                        onClick={() => navigate("edit")}
                      >
                        EDIT
                      </button>
                    )}
                  </div>
                </div>
              </>
            );
          }}
        </AwaitWrapper>
      </div>
    </div>
  );
}

export default About;

async function AboutLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/about?limit=1"
  );

  switch (response.status) {
    case 404:
      throw json(
        { message: "Could not fetch about information." },
        { status: 404 }
      );
    default:
      if (!response.ok)
        throw json(
          {
            message: "Unknow error",
          },
          { status: 500 }
        );
  }
  const resData = await response.json();
  if (Array.isArray(resData.data)) return resData.data;
  return [];
}

export async function loader() {
  return defer({ about: AboutLoader() });
}
