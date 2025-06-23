"use client";

import * as React from "react";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import Box from "@mui/joy/Box";

interface SearchInputProps {
  onSearch: (value: string) => void;
  style?: React.CSSProperties;
}

export function WrapperSearchInput({ onSearch, style }: SearchInputProps) {
  return (
    <Box
      sx={{
        position: { xs: "static", sm: "fixed" },
        top: { xs: "0", sm: "2%", md: "2%", lg: "4.6%" },
        left: { xs: "0", sm: "60px", md: "60px", lg: "unset" },
        zIndex: 1000,
      }}
    >
      <SearchInput onSearch={onSearch} style={style} />
    </Box>
  );
}

export default function SearchInput({ onSearch, style }: SearchInputProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 300) {
      setSearchValue(value);
      setError(false);
      onSearch(value);
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <Input
        startDecorator={<SearchIcon />}
        placeholder="Search"
        value={searchValue}
        onChange={handleChange}
        style={style}
        sx={{
          width: { xs: "100%", sm: "200px", md: "300px" },
          display: { sm: "flex" },
          bgcolor: "var(--NavItem-active-background)",
          borderRadius: "20px",
          border: "1px solid var(--joy-palette-divider)",
          "&:hover": {
            background: "var(--joy-palette-background-mainBg)",
          },
          "& .MuiInput-input": {
            padding: '0px 16px',
            fontSize: "14px",
            color: "var(--joy-palette-neutral-out)",
          },
          "& .MuiInput-startDecorator": {
            color: "var(--joy-palette-neutral-out)",
            marginLeft: "2px",
          },
        }}
      />
      {error && (
        <Typography color="danger" sx={{ mt: 1, fontSize: "14px" }}>
          Search input is too long. Please shorten your query.
        </Typography>
      )}
    </div>
  );
}
