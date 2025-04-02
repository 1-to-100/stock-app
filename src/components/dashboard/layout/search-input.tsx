"use client";

import * as React from "react";
import Input from "@mui/joy/Input";
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'; 

interface SearchInputProps {
  onSearch: (value: string) => void;
  style?: React.CSSProperties; 
}

export default function SearchInput({ onSearch, style }: SearchInputProps) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <Input
      startDecorator={<SearchIcon />}
      placeholder="Search"
      value={searchValue}
      onChange={handleChange}
      style={style}
      sx={{
        width: { xs: "100%", sm: "300px" },
        display: { xs: "none", sm: "flex" },
        bgcolor: "#F5F7FA",
        borderRadius: "20px",
        border: "none",
        "&:hover": {
          bgcolor: "#EDEFF2",
        },
        "& .MuiInput-input": {
          padding: "8px 0px",
          fontSize: "16px",
          color: "#636B74",
        },
        "& .MuiInput-startDecorator": {
          color: "#636B74",
          marginLeft: "2px",
        },
      }}
    />
  );
}