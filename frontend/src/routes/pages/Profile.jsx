import { Link, useRouteLoaderData } from "react-router-dom";

function Profile() {
  const { author } = useRouteLoaderData("profile");
  console.log(author)
  return (
    <>
      <ul>
        <li>Name {author.name}</li>
        <li>Avatar</li>
        <img src={author.avatar} alt="avatar" />
        <li>Description {author.description}</li>
        <Link to="/profile/update">Edit</Link>
      </ul>
      <Link to="/update_password">Update Password</Link>
    </>
  );
}

export default Profile;
