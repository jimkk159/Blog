import Toggle from "react-toggle";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

import "react-toggle/style.css";

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true);

  const systemPrefersDark = useMediaQuery(
    { query: "(prefers-color-scheme: dark)" },
    undefined,
    (isSystemDark) => setIsDark(isSystemDark)
  );

  return (
    <Toggle
      checked={isDark}
      aria-label="Dark mode toggle"
      onChange={({ target }) => setIsDark(target.checked)}
      icons={{ checked: "🌙", unchecked: "🔆" }}
    />
  );
}

export default DarkModeToggle;
