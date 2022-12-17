import React, { createContext, useCallback, useState } from "react";

export const ThemeContext = createContext({
  darkMode: false,
  switch: () => {},
});

function ThemeContextProvider(props) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const switchMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);
  return (
    <ThemeContext.Provider
      value={{ isDarkMode: isDarkMode, switchMode: switchMode }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
export default ThemeContextProvider;
