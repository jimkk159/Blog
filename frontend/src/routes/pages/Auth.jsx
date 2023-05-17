import store from "../../store";
import { authActions } from "../../store/auth-slice";
import { Link, Form, useSearchParams, redirect } from "react-router-dom";

function Auth() {
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get("mode") === "signup";

  return (
    <Form method="post">
      <h1>{isSignup ? "Sign up" : "Login"}</h1>
      {isSignup && (
        <>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" required />
        </>
      )}
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" required />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" required />
      {isSignup && (
        <>
          <label htmlFor="confrimPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
          />
        </>
      )}

      <Link to={`?mode=${isSignup ? "login" : "signup"}`}>
        {isSignup ? "Login" : "Sign up"}
      </Link>
      <button>Save</button>
      <Link to="/forgot_password">forgot password</Link>
    </Form>
  );
}

export default Auth;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  const data = await request.formData();
  const authData = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
    confirmPassword: data.get("confirmPassword"),
  };

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/blog/auth/` + mode,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    }
  );

  const resJSON = await response.json();

  const token = resJSON.token;
  if (!token) return redirect("/");

  store.dispatch(
    authActions.login({
      id: resJSON.data.id,
      role: resJSON.data.role,
      name: resJSON.data.name,
      avatar: resJSON.data.avatar,
    })
  );
  localStorage.setItem("token", token);
  return redirect("/");
}
