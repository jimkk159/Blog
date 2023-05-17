import { useRouteLoaderData } from "react-router-dom";

function BrowserProfile() {
  const { author } = useRouteLoaderData("profile");
  return (
    <ul>
      <li>Name {author.name}</li>
      <li>Avatar</li>
      <img src={author.avatar} alt="avatar" />
      <li>Description {author.description}</li>
    </ul>
  );
}

export default BrowserProfile;
