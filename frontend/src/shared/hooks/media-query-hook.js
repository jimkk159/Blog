import { useEffect, useState } from "react";

// Check the Screen meet the media query
// According to https://stackoverflow.com/questions/54491645/media-query-syntax-for-reactjs
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
