import { Suspense } from "react";
import { defer, Await, useLoaderData } from "react-router-dom";

function About() {
  const { about } = useLoaderData();

  return (
    <Suspense fallback="Loading...">
      <Await resolve={about}>{(about) => <h1>{about}</h1>}</Await>
    </Suspense>
  );
}

export default About;

async function AboutLoader() {
  const response = await fetch("http://localhost:5000/api/v1/blog/tags");
  await response.json();
  return "About";
}

export function loader() {
  return defer({ about: AboutLoader() });
}
