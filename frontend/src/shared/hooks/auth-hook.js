import { useCallback, useState } from "react";

function useAuth() {
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback((uid) => {
    setUserId(uid);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setIsLoggedIn(false);
  }, []);

  return { userId, isLoggedIn, login, logout, showModal, setShowModal };
}

export default useAuth;
