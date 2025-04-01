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

interface UserManagementFilterProps {
  users: User[];
  onFilter: (filteredUsers: User[], filtersApplied: boolean) => void;
}

interface User {
    id: number;
    name: string;
    email: string | string[];
    customer: string;
    role: string;
    persona: string;
    status: string;
    avatar?: string;
    activity?: { id: number; browserOs: string; locationTime: string }[];
  }

const UserManagementFilter: React.FC<UserManagementFilterProps> = ({
  users,
  onFilter,
}) => {
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

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
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
    if (selectedPersonas.length > 0) {
      filtered = filtered.filter((user) =>
        selectedPersonas.includes(user.persona)
      );
    }

    onFilter(filtered, filtersApplied);
    handleClose();
  };

  const handleReset = () => {
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                background: "linear-gradient(120deg, #282490 0%, #3F4DCF 100%)",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {totalFiltersApplied}
            </Box>
          ) : (
            <FunnelIcon fontSize="var(--Icon-fontSize)" />
          )
        }
        onClick={handleOpen}
        sx={{
          borderColor: "#E5E7EB",
          borderRadius: "20px",
          bgcolor: "#FFFFFF",
          color: "#000000",
          padding: "8px 16px",
          "&:hover": {
            bgcolor: "#F5F7FA",
          },
        }}
      >
        Filter
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
            zIndex: 1300,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" spacing={1}>
            <Box sx={{ width: "60%", pr: 1 }}>
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
                sx={{ borderRight: "1px solid #E5E7EB", paddingRight: "20px" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: '6px 12px',
                    bgcolor:
                      activeCategory === "Status" ? "#F5F7FA" : "transparent",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Status")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{ color: "#32383E", fontSize: "16px" }}
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
                    p: '6px 12px',
                    bgcolor:
                      activeCategory === "Customer" ? "#F5F7FA" : "transparent",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Customer")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{ color: "#32383E", fontSize: "16px" }}
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
                    p: '6px 12px',
                    bgcolor:
                      activeCategory === "Role" ? "#F5F7FA" : "transparent",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Role")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{ color: "#32383E", fontSize: "16px" }}
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
                    p: '6px 12px',
                    bgcolor:
                      activeCategory === "Persona" ? "#F5F7FA" : "transparent",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick("Persona")}
                >
                  <Typography
                    level="body-md"
                    fontWeight="400"
                    sx={{ color: "#32383E", fontSize: "16px" }}
                  >
                    Persona
                  </Typography>
                  <ArrowRightIcon fontSize="var(--Icon-fontSize)" />
                </Box>
              </Stack>
            </Box>

            <Box sx={{ width: "40%", pl: 1 }}>
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
                        <Box key={status}>
                          <Checkbox
                            label={
                              status.charAt(0).toUpperCase() + status.slice(1)
                            }
                            checked={selectedStatuses.includes(status)}
                            onChange={() => handleStatusChange(status)}
                            sx={{
                              fontSize: "15px",
                              fontWeight: "400",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          />
                        </Box>
                      ))}
                    {activeCategory === "Customer" &&
                      uniqueCustomers.map((customer) => (
                        <Box key={customer}>
                          <Checkbox
                            label={customer}
                            checked={selectedCustomers.includes(customer)}
                            onChange={() => handleCustomerChange(customer)}
                            sx={{
                              fontSize: "15px",
                              fontWeight: "400",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          />
                        </Box>
                      ))}
                    {activeCategory === "Role" &&
                      uniqueRoles.map((role) => (
                        <Box key={role}>
                          <Checkbox
                            label={role}
                            checked={selectedRoles.includes(role)}
                            onChange={() => handleRoleChange(role)}
                            sx={{
                              fontSize: "15px",
                              fontWeight: "400",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          />
                        </Box>
                      ))}
                    {activeCategory === "Persona" &&
                      uniquePersonas.map((persona) => (
                        <Box key={persona}>
                          <Checkbox
                            label={persona}
                            checked={selectedPersonas.includes(persona)}
                            onChange={() => handlePersonaChange(persona)}
                            sx={{
                              fontSize: "15px",
                              fontWeight: "400",
                              color: "var(--joy-palette-text-primary)",
                            }}
                          />
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
              sx={{ color: "#3D37DD", fontWeight: 600, fontSize: "14px" }}
            >
              Reset filters
            </Button>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #E5E7EB",
                  color: "#111827",
                  fontSize: "14px",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#F3F4F6" },
                }}
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
