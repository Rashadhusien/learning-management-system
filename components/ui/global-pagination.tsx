"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GlobalPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  onPageChange?: (page: number) => void;
}

const GlobalPagination = ({
  currentPage,
  totalPages,
  className,
  onPageChange,
}: GlobalPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNumber.toString());
      return `?${params.toString()}`;
    },
    [searchParams],
  );

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      if (onPageChange) {
        onPageChange(pageNumber);
      } else {
        router.push(createPageURL(pageNumber));
      }
    },
    [onPageChange, router, createPageURL],
  );

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <Pagination>
        <PaginationContent>
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>

          {/* First page */}
          {visiblePages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href={createPageURL(1)}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {visiblePages[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Visible pages */}
          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Last page */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={createPageURL(totalPages)}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              href={createPageURL(currentPage + 1)}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export { GlobalPagination };
export default GlobalPagination;
