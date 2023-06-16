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
        className={
          `${liCSS} my-auto flex h-8 cursor-pointer items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide hover:text-stone-400` +
          ` ${current === 1 && "pointer-events-none text-stone-700"}`
        }
        onClick={onFirst}
      >
        <BiFirstPage className={symbolCSS} />
      </li>
      <li
        className={
          "mx-2 my-auto flex h-8 cursor-pointer items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide hover:text-stone-400" +
          ` ${current === 1 && "pointer-events-none text-stone-700"}`
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
            className={`${liCSS_2} mx-2 my-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl px-3 py-0 text-center font-poppins font-semibold leading-snug tracking-wide hover:text-stone-400 ${
              pageNumber === current
                ? "bg-gray-200 bg-opacity-5 text-stone-400 "
                : "bg-transparent text-stone-500 "
            }`}
            onClick={() => onNavPage(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={
          "mx-2 my-auto flex h-8 cursor-pointer items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide hover:text-stone-400" +
          ` ${current === totalPage && "pointer-events-none text-stone-700"}`
        }
        onClick={onNext}
      >
        <MdNavigateNext className={symbolCSS} />
      </li>
      <li
        className={
          "mx-2 my-auto flex h-8 cursor-pointer items-center rounded-2xl px-1 py-0 text-center leading-snug tracking-wide hover:text-stone-400" +
          `${` ${current === totalPage && "pointer-events-none text-stone-700"}`}`
        }
        onClick={onLast}
      >
        <BiLastPage className={symbolCSS} />
      </li>
    </ul>
  );
}

export default Pagination;
