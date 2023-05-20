import { useMemo } from "react";

export const DOTS = "...";

const range = (start, End) => {
  const length = End - start + 1;
  return Array.from({ length }, (_, index) => index + start);
};

function usePagination({ total, limit, sibling = 1, current, offset }) {
  const pagination = useMemo(() => {
    let totalPage = 0;
    const offsetPage = !!offset ? 1 : 0;
    
    if (total < offset) totalPage = 1;
    else totalPage = Math.ceil((total - offset) / limit) + offsetPage;

    //Case 1
    // Setting the number of pages show on Pagination
    const showGap = 2 * sibling + 3;
    const atLeastShowPageNumber = showGap + 1;
    if (atLeastShowPageNumber >= totalPage) {
      return range(1, totalPage);
    }

    //Settingthe Sibling page boundary
    const leftSiblingIndex = Math.max(current - sibling, 1);
    const rightSiblingIndex = Math.min(current + sibling, totalPage);

    //Judgement the dot show
    const shouldShowLeftDots = leftSiblingIndex > 1 + sibling;
    const shouldShowRightDots = rightSiblingIndex < totalPage - 1 - sibling;

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
  }, [total, limit, sibling, current, offset]);
  return pagination;
}

export default usePagination;
