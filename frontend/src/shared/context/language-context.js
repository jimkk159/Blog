import React from "react";

//Custom Hook
import useTranslation from "../hooks/language-hook";

export const LanguageContext = React.createContext({
  language: null,
});

function LanguageContextProvider(props) {
  const { isEnglish, language, toggleLanguage } = useTranslation();
  return (
    <LanguageContext.Provider
      value={{
        isEnglish: isEnglish,
        language: language,
        toggleLanguage: toggleLanguage,
      }}
    >
      {props.children}
    </LanguageContext.Provider>
  );
}

export default LanguageContextProvider;
