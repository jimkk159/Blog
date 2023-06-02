import { Suspense } from "react";
import MDEditor from "@uiw/react-md-editor";
import { defer, Await, useLoaderData, json } from "react-router-dom";

function About() {
  const { about } = useLoaderData();

  return (
    <Suspense fallback="Loading...">
      <Await resolve={about}>
        {(about) => (
          <div className="flex h-[calc(100vh-4rem)] min-h-[100%] w-full justify-center px-8 py-12 ">
            <div className="relative h-full w-full max-w-3xl rounded bg-white p-16 text-black">
              <MDEditor.Markdown source={about} />
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export default About;

async function AboutLoader() {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/api/v1/about"
  );

  if (!response.ok)
    throw json(
      { message: "Could not fetch about information." },
      { status: 404 }
    );

  const resJSON = await response.json();

  if (!resJSON.data)
    throw json(
      { message: "Could not fetch about information." },
      { status: 404 }
    );

  return resJSON.data;
}

export function loader() {
  return defer({ about: AboutLoader() });
}
