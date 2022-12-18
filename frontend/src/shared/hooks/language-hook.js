//Language JSON
import { useState, useEffect, useCallback } from "react";
import ch from "../../assets/translate/ch/table.json";
import en from "../../assets/translate/en/table.json";

function useTranslation() {
  const [isEnglish, setIsEnglish] = useState(true);
  const [language, setLanguage] = useState(en);

  useEffect(() => {
    //Localization
    const userLanguae = navigator.language || navigator.userLanguae;
    if (userLanguae === "zh-TW" || userLanguae === "zh-CH") {
      setLanguage(ch);
      setIsEnglish(false);
    } else {
      setLanguage(en);
    }
  }, []);

  //Toggle Language
  const toggleLanguage = useCallback(() => {
    setLanguage(!isEnglish ? en : ch); //setState will bundle update even it is behind setIsEnglish
    setIsEnglish((prev) => !prev);
  }, [isEnglish]);

  return { isEnglish, language, toggleLanguage };
}

export default useTranslation;
