import { useEffect, useState } from "react";

// Check the Screen meet the media query
function useMediaQuery(type, screenSize) {
  const [matches, setMatches] = useState(
    window.matchMedia(`(${type}-width:${screenSize}px)`).matches
  );
  useEffect(() => {
    window
      .matchMedia(`(${type}-width:${screenSize}px)`)
      .addEventListener("change", (e) => setMatches(e.matches));
  }, [type, screenSize]);

  return { matches };
}

export default useMediaQuery;
