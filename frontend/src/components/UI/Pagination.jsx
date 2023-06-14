import React from "react";

//Icon
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

// hooks
import usePagination, { DOTS } from "../../hooks/pagination-hook";

function Pagination({
  size,
  total = 0,
  limit = 15,
  sibling = 1,
  current = 1,
  onNavPage,
  offset = 0,
}) {
  let ulCSS = "";
  let liCSS = "";
  let liCSS_2 = "";
  let symbolCSS = "";
  switch (size) {
    case "xs":
      ulCSS = "p-1";
      liCSS_2 = "text-sm";
      symbolCSS = "h-[22px] w-[22px]";
      break;
    case "small":
      ulCSS = "p-2";
      liCSS_2 = "text-base";
      symbolCSS = "h-[25px] w-[25px]";
      break;
    default:
      ulCSS = "p-4";
      liCSS = "mx-2";
      liCSS_2 = "text-2xl";
      symbolCSS = "h-[36px] w-[36px]";
  }

  // custom hooks
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

  // custom functions
  const onFirst = () => onNavPage(1);
  const onLast = () => onNavPage(totalPage);

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

  if (current < 1 || paginationRange.length < 2) return null;
  return (
    <ul className={`flex w-full list-none justify-center ${ulCSS}`}>
      <li
        className={`${liCSS} my-auto flex h-8 items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide`}
        onClick={onFirst}
      >
        <BiFirstPage className={symbolCSS} />
      </li>
      <li
        className={
          "mx-2 my-auto flex h-8 items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide" +
          ` ${current === 1 && "pointer-events-none"}`
        }
        onClick={onPrev}
      >
        <MdNavigateBefore className={symbolCSS} />
      </li>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={index}
              className={
                "font-sans mx-2 my-auto flex h-8 cursor-default items-center rounded-2xl bg-transparent px-3 py-0 text-center text-2xl font-semibold leading-snug tracking-wide"
              }
            >
              &#8230;
            </li>
          );
        }
        return (
          <li
            key={index}
            className={`${liCSS_2} font-sans mx-2 my-auto flex h-8 cursor-default items-center rounded-2xl bg-transparent px-3 py-0 text-center font-semibold leading-snug tracking-wide ${
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
          "mx-2 my-auto flex h-8 items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide" +
          ` ${current === totalPage && "pointer-events-none"}`
        }
        onClick={onNext}
      >
        <MdNavigateNext className={symbolCSS} />
      </li>
      <li
        className="mx-2 my-auto flex h-8 items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide"
        onClick={onLast}
      >
        <BiLastPage className={symbolCSS} />
      </li>
    </ul>
  );
}

export default Pagination;
