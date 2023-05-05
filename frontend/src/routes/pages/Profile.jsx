import { Link } from "react-router-dom";

function Profile() {

  return (
    <>
      <h1>Profile</h1>
      <ul>
        <li>
          <Link to="/profile/update_password">Update Password</Link>
        </li>
      </ul>
    </>
  );
}

export default Profile;
