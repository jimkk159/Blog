import { createContext } from "react";

//Custom Hook
import useAuth from "../hooks/auth-hook";

export const AuthContext = createContext({
  isLoggedIn: false,
  showModal: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
  setShowModal: () => {},
});

const AuthContextProvider = (props) => {
  const { userId, isLoggedIn, login, logout, showModal, setShowModal } =
    useAuth();
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        showModal: showModal,
        userId: userId,
        token: null,
        login: login,
        logout: logout,
        setShowModal: setShowModal,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
