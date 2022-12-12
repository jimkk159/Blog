import { useCallback, useState } from "react";

function useAuth() {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(
    (uid) => {
      console.log("login");
      setUserId(uid);
      setIsLoggedIn(true);
    },
    []
  );

  const logout = useCallback(() => {
    console.log("logout");
    setUserId(null);
    setIsLoggedIn(false);
  }, []);

  return { userId, isLoggedIn, login, logout };
}

export default useAuth;
