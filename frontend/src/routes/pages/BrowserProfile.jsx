import { useRouteLoaderData } from "react-router-dom";

function BrowserProfile() {
  const { author } = useRouteLoaderData("profile");
  return (
    <ul>
      <li>Name {author.name}</li>
      <li>Avatar {author.avatar}</li>
      <li>Description {author.description}</li>
    </ul>
  );
}

export default BrowserProfile;
