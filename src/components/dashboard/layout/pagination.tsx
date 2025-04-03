import * as React from "react";
import Button from "@mui/joy/Button";
import { useState } from "react";
import { CaretLineLeft as CaretLineLeft } from "@phosphor-icons/react/dist/ssr/CaretLineLeft";
import { ArrowLeft as ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled: boolean;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  disabled
}: PaginationProps): React.JSX.Element {
  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };
 
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
   
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
   
    if (startPage > 1) {
      pages.unshift("...");
      pages.unshift(1);
    }
    if (endPage < totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "16px", gap: "16px" }}>
      <Button
        variant="outlined"
        onClick={handleFirstPage}
        disabled={disabled || currentPage === 1}
        sx={{
          borderRadius: "20px",
          padding: "8px 16px",
          minWidth: "auto",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: currentPage === totalPages ? "var(--joy-palette-text-secondary)" : "var(--joy-palette-text-primary)",
          borderColor: "gray",
        }}
      >
        <CaretLineLeft />
        <span>First</span>
      </Button>

     
      <Button
        variant="outlined"
        onClick={handlePreviousPage}
        disabled={disabled || currentPage === 1}
        sx={{
          borderRadius: "20px",
          padding: "8px 16px",
          minWidth: "auto",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: currentPage === totalPages ? "var(--joy-palette-text-secondary)" : "var(--joy-palette-text-primary)",
          borderColor: "gray",
        }}
      >
        <ArrowLeft />
        <span>Previous</span>
      </Button>
     
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            variant={currentPage === page ? "solid" : "outlined"}
            onClick={() => handlePageClick(page)}
            disabled={disabled}
            sx={{
              borderRadius: "50%", 
              minWidth: "40px",
              height: "40px",
            }}
          >
            {page}
          </Button>
        ) : (
          <span
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              color: disabled ? "var(--joy-palette-text-disabled)" : "gray",
            }}
          >
            {page}
          </span>
        )
      )}
     
      <Button
        variant="outlined"
        onClick={handleNextPage}
        disabled={disabled || currentPage === totalPages}
        sx={{
          borderRadius: "20px",
          padding: "8px 16px",
          minWidth: "auto",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: currentPage === totalPages ? "var(--joy-palette-text-secondary)" : "var(--joy-palette-text-primary)",
          borderColor: "gray",
        }}
      >
        <span>Next</span>
        <ArrowRight />
      </Button>
      
      <Button
        variant="outlined"
        onClick={handleLastPage}
        disabled={disabled || currentPage === totalPages}
        sx={{
          borderRadius: "20px",
          padding: "8px 16px",
          minWidth: "auto",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: currentPage === totalPages ? "var(--joy-palette-text-secondary)" : "var(--joy-palette-text-primary)",
          borderColor: "gray",
        }}
      >
        <span>Last</span>
        <ArrowRight />
      </Button>
    </div>
  );
}