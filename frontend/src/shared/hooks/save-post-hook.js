import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function useAutoSave(savePostCallback) {
  const [prevToken, setPrevToken] = useState(null);
  const { token, isLoggedIn } = useSelector((state) => state.auth);

  //Rember the previous token when auto logout to save the post
  useEffect(() => {
    setPrevToken(token);
  }, [token]);

  useEffect(() => {
    if (!isLoggedIn) {
      savePostCallback(prevToken);
      setPrevToken(null);
    }
  }, [prevToken, isLoggedIn, savePostCallback]);
}

export default useAutoSave;
