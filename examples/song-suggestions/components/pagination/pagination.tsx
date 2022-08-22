import { React, classKebab, useStyleSheet } from "../../deps.ts"
import { usePagination, DOTS } from '../../hooks/mod.ts';
import stylesheet from './pagination.scss.js';

interface PaginationProps {
  onPageChange: (page: number) => void
  totalCount: number
  siblingCount: number
  currentPage: number
  pageSize: number
  className?: string
}

export default function Pagination ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className
}: PaginationProps) {
  useStyleSheet(stylesheet)
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul
      className={`pagination-container ${className}`}
    >
      <li
        className={`pagination-item ${classKebab({
          disabled: currentPage === 1
        })}`}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li
            className={`pagination-item ${classKebab({
              selected: pageNumber === currentPage
            })}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={`pagination-item ${classKebab({
          disabled: currentPage === lastPage
        })}`}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  );
};

