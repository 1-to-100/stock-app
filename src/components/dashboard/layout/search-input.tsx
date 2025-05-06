"use client";

import * as React from "react";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";

interface SearchInputProps {
  onSearch: (value: string) => void;
  style?: React.CSSProperties;
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
            padding: "8px 0px",
            fontSize: "16px",
            color: "var(--joy-palette-text-primary)",
          },
          "& .MuiInput-startDecorator": {
            color: "var(--joy-palette-text-primary)",
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
