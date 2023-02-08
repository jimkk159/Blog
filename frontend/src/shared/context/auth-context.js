import { createContext } from "react";

//Custom Hook
import useAuth from "../hooks/auth-hook";

export const AuthContext = createContext({
  isLoggedIn: false,
  uid: null,
  token: null,
  login: () => {},
  logout: () => {},
});

function AuthContextProvider(props) {
  const { uid, isLoggedIn, login, logout } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        uid,
        token: null,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
