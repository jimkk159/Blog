import { useCallback, useState } from "react";

function useAutoSave(savePostCallback) {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback((uid) => {
    setUid(uid);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUid(null);
    setIsLoggedIn(false);
  }, []);

  //Rember the previous token when auto logout to save the post
  useEffect(() => {
    setPrevToken(token);
  }, [token]);

  useEffect(() => {
    if (!isLoggedIn && isEdit) {
      savePostHandler(prevToken);
      setToken(null);
    }
  }, [prevToken, isLoggedIn, isEdit, setIsEdit, savePostHandler]);

  return { uid, isLoggedIn, login, logout };
}

export default useAutoSave;
