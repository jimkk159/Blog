import { useState, useEffect, useCallback } from "react";

function useScroll() {
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(window.scrollY);

  // Behavior of Scroll Event
  const scrollHandler = useCallback(
    (event) => {
      const newScrollPosition = event.currentTarget.scrollY;

      // Scrolling Up Condition
      if (scrollPosition > newScrollPosition) {
        setIsScrollingUp(true);
        setIsScrollingDown(false);

        // Scrolling Down Condition
      } else if (scrollPosition < newScrollPosition) {
        setIsScrollingUp(false);
        setIsScrollingDown(true);

      }
      setScrollPosition(window.scrollY);
    },
    [scrollPosition]
  );

  useEffect(() => {
    //Set Scroll Position when rerender
    //( React default scrollY is 0 before first render)
    setScrollPosition(window.scrollY);

    //trigger 「scrollHandler」 whenn scroll
    window.addEventListener("scroll", scrollHandler);

    //Clean function
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);

  return { scrollPosition, isScrollingUp, isScrollingDown };
}

export default useScroll;
