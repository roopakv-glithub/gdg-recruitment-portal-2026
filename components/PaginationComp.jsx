"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { HiOutlineChevronDoubleLeft } from "react-icons/hi";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

const PaginationComp = ({
  pageIndex,
  pages,
  nextPage,
  canNext,
  previousPage,
  canPrev,
  goto,
  pageCount,
}) => {
  let pageNum = [];
  for (let i = 1; i <= pageCount; i++) {
    pageNum.push(i);
  }
  let dispPageNum = [];
  dispPageNum.push(pageNum[pageIndex]);
  dispPageNum.push(pageNum[pageIndex + 1]);
  dispPageNum.push(pageNum[pageIndex + 2]);

  dispPageNum = dispPageNum.filter((pg) => pg !== undefined);

  return (
    <div className="flex items-center justify-between p-5 pt-0">
      <div className="w-full text-sm p-3">
        Page {pageIndex + 1} of {pages}
      </div>
      <Pagination>
        <PaginationContent className="cursor-pointer">
          <PaginationItem
            className={!canPrev ? "opacity-50 cursor-not-allowed" : ""}
            onClick={() => goto(0)}
          >
            <HiOutlineChevronDoubleLeft />
          </PaginationItem>
          <PaginationItem
            className={!canPrev ? "opacity-50 cursor-not-allowed" : ""}
          >
            <PaginationPrevious onClick={() => previousPage()} />
          </PaginationItem>
          {dispPageNum.map((num) => (
            <PaginationItem key={num}>
              {pageIndex + 1 === num ? (
                <PaginationLink
                  key={num}
                  isActive
                  onClick={() => goto(num - 1)}
                >
                  {num}
                </PaginationLink>
              ) : (
                <PaginationLink key={num} onClick={() => goto(num - 1)}>
                  {num}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem
            className={!canNext ? "opacity-50 cursor-not-allowed" : ""}
          >
            <PaginationNext onClick={() => nextPage()} />
          </PaginationItem>
          <PaginationItem
            className={!canNext ? "opacity-50 cursor-not-allowed" : ""}
            onClick={() => goto(pageCount - 1)}
          >
            <HiOutlineChevronDoubleRight />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComp;
