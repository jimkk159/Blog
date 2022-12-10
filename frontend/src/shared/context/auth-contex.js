import { createContext } from "react";

//CUSTOM Hook
import useAuth from "../hooks/auth-hook";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = (props) => {
  const { userId, isLoggedIn, login, logout } = useAuth();
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        token: null,
        login: login,
        logout: logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
