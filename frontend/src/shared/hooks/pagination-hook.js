import { useMemo } from "react";

export const DOTS = "...";

const range = (start, End) => {
  const length = End - start + 1;
  return Array.from({ length }, (_, index) => index + start);
};

function usePagination({
  totalPosts,
  postsPerPage,
  siblingCount = 1,
  currentPage,
  offsetPosts, //Home Page Posts
}) {
  const pagination = useMemo(() => {
    let totalPage = 0;
    if (totalPosts < offsetPosts) {
      totalPage = 1;
    } else {
      totalPage = Math.ceil((totalPosts - offsetPosts) / postsPerPage) + 1;
    }

    //Case 1
    // Setting the number of pages show on Pagination
    const showGap = 2 * siblingCount + 3;
    const atLeastShowPageNumber = showGap + 1;
    if (atLeastShowPageNumber >= totalPage) {
      return range(1, totalPage);
    }

    //Settingthe Sibling page boundary
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPage);

    //Judgement the dot show
    const shouldShowLeftDots = leftSiblingIndex > 1 + siblingCount;
    const shouldShowRightDots =
      rightSiblingIndex < totalPage - 1 - siblingCount;

    //Case 2 only right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = showGap;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPage];
    }

    //Case 3 only right dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = showGap;
      let rightRange = range(totalPage - rightItemCount + 1, totalPage);

      return [1, DOTS, ...rightRange];
    }

    //Case 4 Both side have dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);

      return [1, DOTS, ...middleRange, DOTS, totalPage];
    }
  }, [totalPosts, postsPerPage, siblingCount, currentPage, offsetPosts]);
  return pagination;
}

export default usePagination;
//reference:https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
