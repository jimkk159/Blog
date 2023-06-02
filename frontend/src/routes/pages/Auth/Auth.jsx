import validator from "validator";
import { useCallback } from "react";
import store from "../../../store";
import { authActions } from "../../../store/auth-slice";
import { GoogleLoginButton } from "react-social-login-buttons";
import {
  Link,
  Form,
  redirect,
  json,
  useActionData,
  useSearchParams,
} from "react-router-dom";
import Input from "../../../components/UI/Input";
import useForm from "../../../hooks/form-hook";

function Auth() {
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get("mode") === "signup";
  const data = useActionData();
  const { formState, inputHandler } = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  // TODO
  const googleHandler = useCallback((event) => {
    event.preventDefault();
    window.open(
      `${process.env.REACT_APP_BACKEND_URL + "/api/v1/oauth/google"}`,
      "Login Google",
      `left=${window.innerWidth / 3}, top=100, width=400, height=500`
    );
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Form
        method="post"
        className="flex w-[448px] flex-col justify-center rounded-lg bg-white p-6 text-black"
      >
        <p className="mb-4 text-center text-3xl ">
          {isSignup ? "Sign up" : "Login"}
        </p>
        {isSignup && (
          <Input
            type="text"
            name="name"
            placeholder="Name"
            errorMessage={"Please enter your name."}
            onInput={inputHandler}
            validators={(e) => !validator.isEmpty(e)}
          />
        )}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          errorMessage={"Please enter a valid email."}
          onInput={inputHandler}
          validators={validator.isEmail}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          errorMessage={"Please enter at least 6 characters."}
          onInput={inputHandler}
          validators={(e) => e.length >= 6}
        />
        {isSignup && (
          <Input
            type="password"
            name="confirmPassword"
            className="m-0 my-1.5 box-border h-12 overflow-ellipsis rounded border border-gray-400 px-2 py-2.5 text-base focus:outline-gray-400"
            placeholder="Password again"
            errorMessage={"Please enter at least 6 characters."}
            onInput={inputHandler}
            validators={(e) => e.length >= 6}
          />
        )}
        <button
          type="submit"
          disabled={!formState.isValid}
          className="m-0 my-1.5 box-border h-12 rounded border bg-blue-500 px-2 py-2.5 text-center font-roboto text-lg text-white disabled:bg-blue-300"
        >
          {isSignup ? "Sign up" : "Login"}
        </button>
        <div className="relative flex w-full items-center justify-center py-2">
          <span className="text-black  before:absolute before:left-0 before:top-1/2 before:h-[1px] before:w-[calc(50%-1rem)] before:bg-gray-400 after:absolute after:right-0 after:top-1/2 after:h-[1px] after:w-[calc(50%-1rem)] after:bg-gray-400">
            or
          </span>
        </div>
        <div className="my-2">
          <GoogleLoginButton
            preventActiveStyles={true}
            onClick={googleHandler}
          />
        </div>
        {!isSignup && (
          <>
            <div className="justify-left mx-2 my-2 flex items-center text-base">
              <p>Create your account?</p>
              <Link
                to="/auth?mode=signup"
                className="mx-3 text-left text-blue-400"
              >
                Signup
              </Link>
            </div>
            <Link
              to="/forgot_password"
              className="mx-2 my-2 text-left text-blue-400"
            >
              Forgot your password?
            </Link>
          </>
        )}
        {isSignup && (
          <div className="flex items-center justify-start px-2 py-4 text-base">
            <p>Already has an account?</p>
            <Link to={"/auth?mode=login"} className="mx-4 text-blue-400">
              Login
            </Link>
          </div>
        )}
      </Form>
    </div>
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
    process.env.REACT_APP_BACKEND_URL + `/api/v1/auth/` + mode,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    }
  );
  if (response.status !== 422)
    throw json(
      {
        message:
          mode === "login" ? "Unknow Login error" : "Unknow Signup error",
      },
      { status: 500 }
    );
  else if (response.status === 422) return response;

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
