import { useSelector } from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import { json, defer, useNavigate, useRouteLoaderData } from "react-router-dom";

// components
import PostWrapper from "../../../components/Wrapper/PostWrapper";
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";

// helper
import * as helper from "../../../utils/helper";

function About() {
  // redux
  const auth = useSelector((state) => state.auth);

  // react-router
  const navigate = useNavigate();
  const { about } = useRouteLoaderData("about");

  const bottom = (
    <div className="flex justify-end font-pt-serif ">
      {helper.hasPermissionToAbout(auth) && (
        <AwaitWrapper resolve={about}>
          {() => (
            <button
              type="submit"
              className="ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl hover:border-blue-600 hover:bg-blue-600 hover:text-white disabled:border-blue-400 disabled:bg-blue-400 disabled:text-white"
              onClick={() => navigate("edit")}
            >
              EDIT
            </button>
          )}
        </AwaitWrapper>
      )}
    </div>
  );

  return (
    <PostWrapper bottom={bottom} className="px-2 pb-12 pt-32 md:px-8 md:pt-12">
      <div className="min-h-screen rounded bg-white p-8">
        <AwaitWrapper
          resolve={about}
          spinner={{ color: "#ec6090", full: true }}
        >
          {(about) => {
            let input = null;
            if (about[0] && about[0].content) input = about[0].content;
            return <MDEditor.Markdown source={input} />;
          }}
        </AwaitWrapper>
      </div>
    </PostWrapper>
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
