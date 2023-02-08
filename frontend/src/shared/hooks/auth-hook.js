import { useCallback, useState } from "react";

function useAuth() {
  const [uid, setUid] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback((uid) => {
    setUid(uid);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUid(null);
    setIsLoggedIn(false);
  }, []);

  return { uid, isLoggedIn, login, logout };
}

export default useAuth;
