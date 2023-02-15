import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function useAutoSave(savePostCallback, isToHome = false) {
  const [prevToken, setPrevToken] = useState(null);
  const { token } = useSelector((state) => state.auth);

  //React Router
  const navigate = useNavigate();

  //Rember the previous token when auto logout to save the post
  useEffect(() => {
    setPrevToken(token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      savePostCallback(prevToken);
      setPrevToken(null);
      if (isToHome) {
        navigate("/");
      }
    }
  }, [prevToken, token, savePostCallback, isToHome, navigate]);
}

export default useAutoSave;
