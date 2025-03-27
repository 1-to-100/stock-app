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
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
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
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
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
        disabled={currentPage === 1}
        sx={{
          borderRadius: "20px",
          padding: "8px 16px",
          minWidth: "auto",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: currentPage === 1 ? "gray" : "black",
          borderColor: "gray",
        }}
      >
        <CaretLineLeft />
        <span>First</span>
      </Button>

     
      <Button
        variant="outlined"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        sx={{
          borderRadius: "20px",
          padding: "8px 16px",
          minWidth: "auto",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: currentPage === 1 ? "gray" : "black",
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
            sx={{
              borderRadius: "50%", 
              minWidth: "40px",
              height: "40px",
              backgroundColor: currentPage === page ? "#4F46E5" : "transparent",
              color: currentPage === page ? "#FFFFFF" : "#000000",
              borderColor: "gray",
              "&:hover": {
                backgroundColor: currentPage === page ? "#4338CA" : "#F5F7FA",
              },
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
              color: "gray",
            }}
          >
            {page}
          </span>
        )
      )}
     
      <Button
        variant="outlined"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        sx={{
          borderRadius: "20px",
          padding: "8px 16px",
          minWidth: "auto",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: currentPage === totalPages ? "gray" : "black",
          borderColor: "gray",
        }}
      >
        <span>Next</span>
        <ArrowRight />
      </Button>
      
      <Button
        variant="outlined"
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        sx={{
          borderRadius: "20px",
          padding: "8px 16px",
          minWidth: "auto",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: currentPage === totalPages ? "gray" : "black",
          borderColor: "gray",
        }}
      >
        <span>Last</span>
        <ArrowRight />
      </Button>
    </div>
  );
}