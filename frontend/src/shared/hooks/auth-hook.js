import { useState } from "react";

function useAuth() {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = (uid) => {
    setUserId(userId);
    setIsLoggedIn(true);
    console.log("login", isLoggedIn);
  };
  const logout = () => {
    setUserId(null);
    setIsLoggedIn(false);
    console.log("logout", isLoggedIn);
  };
  return { userId, isLoggedIn, login, logout };
}

export default useAuth;
