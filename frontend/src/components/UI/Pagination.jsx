import React from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

//Icon
import { BiFirstPage, BiLastPage } from "react-icons/bi";

//Custom Hook
import usePagination, { DOTS } from "../../hooks/pagination-hook";

function Pagination({
  total = 0,
  limit = 15,
  sibling = 1,
  current = 1,
  onNavPage,
  offset = 0,
}) {
  limit = 2;
  const paginationRange =
    usePagination({
      total: +total,
      limit: +limit,
      sibling: +sibling,
      current: +current,
      offset: +offset,
    }) ?? [];

  const totalPage = paginationRange
    ? paginationRange[paginationRange.length - 1]
    : 1;

  const onFirst = () => {
    onNavPage(1);
  };
  const onNext = () => {
    if (totalPage > current) {
      onNavPage(current + 1);
    }
  };
  const onPrev = () => {
    if (current > 1) {
      onNavPage(current - 1);
    }
  };
  const onLast = () => {
    onNavPage(totalPage);
  };
  if (current < 1 || paginationRange.length < 2) return null;
  return (
    <ul className="flex w-full list-none justify-center p-4">
      <li
        className="mx-1 my-auto flex h-8 items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide"
        onClick={onFirst}
      >
        <BiFirstPage className="h-[25px] w-[25px]" />
      </li>
      <li
        className={
          "mx-1 my-auto flex h-8 items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide" +
          ` ${current === 1 && "pointer-events-none"}`
        }
        onClick={onPrev}
      >
        <MdNavigateBefore className="h-[25px] w-[25px]" />
      </li>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={index}
              className={
                "mx-1 my-auto flex h-8 cursor-default items-center rounded-2xl bg-transparent px-3 py-0 text-center font-sans text-base font-semibold leading-snug tracking-wide"
              }
            >
              &#8230;
            </li>
          );
        }
        return (
          <li
            key={index}
            className={`mx-1 my-auto flex h-8 cursor-default items-center rounded-2xl bg-transparent px-3 py-0 text-center font-sans text-base font-semibold leading-snug tracking-wide ${
              pageNumber === current && "bg-slate-500"
            }`}
            onClick={() => onNavPage(pageNumber)}
          >
            <p>{pageNumber}</p>
          </li>
        );
      })}
      <li
        className={
          "mx-1 my-auto flex h-8 items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide" +
          ` ${current === 1 && "pointer-events-none"}`
        }
        onClick={onNext}
      >
        <MdNavigateNext className="h-[25px] w-[25px]" />
      </li>
      <li
        className="mx-1 my-auto flex h-8 items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide"
        onClick={onLast}
      >
        <BiLastPage className="h-[25px] w-[25px]" />
      </li>
    </ul>
  );
}

export default Pagination;
