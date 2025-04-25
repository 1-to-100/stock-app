"use client";

import * as React from "react";
import { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import { Funnel as FunnelIcon } from "@phosphor-icons/react/dist/ssr/Funnel";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { X as X } from "@phosphor-icons/react/dist/ssr/X";
import { ApiUser } from "@/contexts/auth/types";


interface UserManagementFilterProps {
  users: ApiUser[];
  onFilter: (filteredUsers: ApiUser[], filtersApplied: boolean) => void;
}

const UserManagementFilter = ({
  users,
  onFilter,
}: UserManagementFilterProps) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>("Status");

  const uniqueStatuses = Array.from(new Set(users.map((user) => user.status)));
  const uniqueCustomers = Array.from(
    new Set(users.map((user) => user.customer))
  );
  const uniqueRoles = Array.from(new Set(users.map((user) => user.role)));
  const uniquePersonas = Array.from(new Set(users.map((user) => user.persona)));

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
    setActiveCategory("Status");
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleCustomerChange = (customer: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customer)
        ? prev.filter((c) => c !== customer)
        : [...prev, customer]
    );
  };

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handlePersonaChange = (persona: string) => {
    setSelectedPersonas((prev) =>
      prev.includes(persona)
        ? prev.filter((p) => p !== persona)
        : [...prev, persona]
    );
  };

  const handleApply = () => {
    let filtered = users;
    const filtersApplied =
      selectedStatuses.length > 0 ||
      selectedCustomers.length > 0 ||
      selectedRoles.length > 0 ||
      selectedPersonas.length > 0;

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((user) =>
        selectedStatuses.includes(user.status)
      );
    }
    if (selectedCustomers.length > 0) {
      filtered = filtered.filter((user) =>
        selectedCustomers.includes(user.customer)
      );
    }
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((user) => selectedRoles.includes(user.role));
    }

    onFilter(filtered, filtersApplied);
    handleClose();
  };

  const handleReset = (
    event: React.MouseEvent<SVGSVGElement | HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setSelectedStatuses([]);
    setSelectedCustomers([]);
    setSelectedRoles([]);
    setSelectedPersonas([]);
    onFilter(users, false);
    handleClose();
  };

  const totalFiltersApplied =
    selectedStatuses.length +
    selectedCustomers.length +
    selectedRoles.length +
    selectedPersonas.length;

  return (
    <>
      <Button
        variant="outlined"
        startDecorator={
          totalFiltersApplied > 0 ? (
            <X fontSize="var(--Icon-fontSize)" onClick={handleReset} />
          ) : (
            <FunnelIcon fontSize="var(--Icon-fontSize)" />
          )
        }
        onClick={handleOpen}
        sx={{
          borderColor: totalFiltersApplied > 0 ? "transparent" : "var(--joy-palette-divider)",
          borderRadius: "20px",
          background: totalFiltersApplied > 0 ? "#C7C5FC" : "var(--joy-palette-background-mainBg)",
          color:
            totalFiltersApplied > 0
              ? "#3D37DD"
              : "var(--joy-palette-text-primary)",
          padding: "7px 14px",
          // "&:hover": {
          //   background: totalFiltersApplied > 0 ? "#C7C5FC" : "#F5F7FA",
          // },
        }}
      >
        {totalFiltersApplied > 0
          ? `${totalFiltersApplied} filter${
              totalFiltersApplied !== 1 ? "s" : ""
            } apply`
          : "Filter"}
      </Button>

      {open && anchorEl && (
        <Sheet
          sx={{
            position: "absolute",
            top: anchorEl.getBoundingClientRect().bottom + 5,
            right: "9.5vw",
            width: "550px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid var(--joy-palette-divider)",
            zIndex: 1300,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={1}>
            <Box sx={{ width: "58%", pr: 1 }}>
              <Typography
                level="body-sm"
                sx={{
                  color: "var(--joy-palette-text-secondary)",
                  fontSize: "12px",
                  mb: 1.5,
                }}
              >
                {totalFiltersApplied} filter
                {totalFiltersApplied !== 1 ? "s" : ""} apply
              </Typography>
              <Stack
                spacing={1}
                sx={{ borderRight: "1px solid var(--joy-palette-divider)", paddingRight: "20px" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "6px 12px",
                    bgcolor:
                      activeCategory === "Status" ? "var(--joy-palette-background-mainBg)" : "transparent",
                    borderRadius: "4px",
                    border:  activeCategory === "Status" ?  "1px solid var(--joy-palette-divider)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Status")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{ color: activeCategory === "Status" ? "var(--joy-palette-text-primary)" : "#32383E", fontSize: "16px" }}
                  >
                    Status
                  </Typography>
                  <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "6px 12px",
                    bgcolor:
                      activeCategory === "Customer" ? "var(--joy-palette-background-mainBg)" : "transparent",
                    borderRadius: "4px",
                    border:  activeCategory === "Customer" ?  "1px solid var(--joy-palette-divider)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Customer")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{ color: activeCategory === "Customer" ? "var(--joy-palette-text-primary)" : "#32383E", fontSize: "16px" }}
                  >
                    Customer
                  </Typography>
                  <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "6px 12px",
                    bgcolor:
                      activeCategory === "Role" ? "var(--joy-palette-background-mainBg)" : "transparent",
                    borderRadius: "4px",
                    border:  activeCategory === "Role" ?  "1px solid var(--joy-palette-divider)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Role")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{ color: activeCategory === "Role" ? "var(--joy-palette-text-primary)" : "#32383E", fontSize: "16px" }}
                  >
                    Role
                  </Typography>
                  <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "6px 12px",
                    bgcolor:
                      activeCategory === "Persona" ? "var(--joy-palette-background-mainBg)" : "transparent",
                    borderRadius: "4px",
                    border:  activeCategory === "Persona" ?  "1px solid var(--joy-palette-divider)" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Persona")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{ color: activeCategory === "Persona" ? "var(--joy-palette-text-primary)" : "#32383E", fontSize: "16px" }}
                  >
                    Persona
                  </Typography>
                  <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                </Box>
              </Stack>
            </Box>

            <Box sx={{ width: "42%", pl: 1 }}>
              {activeCategory && (
                <>
                  <Typography
                    level="body-md"
                    fontWeight="600"
                    sx={{
                      fontSize: "12px",
                      mb: 1.5,
                      color: "var(--joy-palette-text-primary)",
                    }}
                  >
                    Select {activeCategory.toLowerCase()}
                  </Typography>
                  <Stack spacing={1}>
                    {activeCategory === "Status" &&
                      uniqueStatuses.map((status) => (
                        <Box
                          key={status}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selectedStatuses.includes(status)}
                            onChange={() => handleStatusChange(status)}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "14px",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Typography>
                        </Box>
                      ))}
                    {activeCategory === "Customer" &&
                      uniqueCustomers.map((customer) => (
                        <Box
                          key={customer}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selectedCustomers.includes(customer)}
                            onChange={() => handleCustomerChange(customer)}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "14px",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          >
                            {customer.charAt(0).toUpperCase() +
                              customer.slice(1)}
                          </Typography>
                        </Box>
                      ))}
                    {activeCategory === "Role" &&
                      uniqueRoles.map((role) => (
                        <Box
                          key={role}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selectedRoles.includes(role)}
                            onChange={() => handleRoleChange(role)}
                          />
                          <Typography
                            level="body-sm"
                            sx={{
                              fontSize: "14px",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </Typography>
                        </Box>
                      ))}
                  </Stack>
                </>
              )}
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
            }}
          >
            <Button
              variant="plain"
              onClick={handleReset}
            >
              Reset filters
            </Button>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                onClick={handleApply}
                sx={{
                  borderRadius: "20px",
                  bgcolor: "#4F46E5",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#4338CA" },
                }}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Sheet>
      )}
    </>
  );
};

export default UserManagementFilter;
