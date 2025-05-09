"use client";

import * as React from "react";
import { useState } from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import SearchInput from "@/components/dashboard/layout/search-input";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import { useUserInfo } from "@/hooks/use-user-info";
import EmptyCategoriesList from "@/components/dashboard/documentation/empty-categories-list";
import CategoriesListComponent from "@/components/dashboard/documentation/categories-list-component";
import AddEditCategoryModal from "@/components/dashboard/modals/AddEditCategoryModal";
import { getCategoriesList } from "@/lib/api/categories";
import { Category } from "@/contexts/auth/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface HttpError extends Error {
  response?: {
    status: number;
  };
}

export default function Page(): React.JSX.Element {
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const { userInfo } = useUserInfo();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery<Category[], HttpError>({
    queryKey: ['categories'],
    queryFn: getCategoriesList
  });

  const handleAddCategoryModal = () => {
    setOpenAddCategoryModal(true);
  };

  const handleCloseAddCategoryModal = () => {
    setOpenAddCategoryModal(false);
  };

  const handleFetchCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const handleSearch = (searchTerm: string) => {};

  if (error && error.response?.status === 403) {
    return (
      <Box sx={{ textAlign: "center", mt: 20 }}>
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "600",
            color: "var(--joy-palette-text-primary)",
          }}
        >
          Access Denied
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "300",
            color: "var(--joy-palette-text-secondary)",
            mt: 1,
          }}
        >
          You do not have the required permissions to view this page. <br />{" "}
          Please contact your administrator if you believe this is a mistake.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: "var(--Content-padding)" } }}>
      <Box
        sx={{
          position: { xs: "static", sm: "fixed" },
          top: { xs: "0", sm: "1.5%", md: "1.5%", lg: "4%" },
          left: { xs: "0", sm: "60px", md: "60px", lg: "unset" },
          zIndex: 1000,
        }}
      >
        <SearchInput onSearch={handleSearch} />
      </Box>
      <Stack spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 6, sm: 0 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          sx={{ alignItems: { xs: "stretch", sm: "flex-start" } }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              width: "100%",
            }}
          >
            <Typography fontSize={{ xs: "xl3", lg: "xl4" }} level="h1">
              Documentation
            </Typography>
            <Box sx={{ position: "relative" }}>
              <Button
                sx={{ marginRight: "8px" }}
                variant="outlined"
                color="primary"
                onClick={handleAddCategoryModal}
                startDecorator={<PlusIcon fontSize="var(--Icon-fontSize)" />}
              >
                Add category
              </Button>
              <Button
                variant="solid"
                color="primary"
                startDecorator={<PlusIcon fontSize="var(--Icon-fontSize)" />}
              >
                Add article
              </Button>
            </Box>
          </Box>
        </Stack>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : categories.length > 0 ? (
          <CategoriesListComponent categories={categories} fetchCategories={handleFetchCategories} />
        ) : (
          <EmptyCategoriesList fetchCategories={handleFetchCategories} />
        )}
      </Stack>
      <AddEditCategoryModal
        open={openAddCategoryModal}
        onClose={handleCloseAddCategoryModal}
        fetchCategories={handleFetchCategories}
      />
    </Box>
  );
}
