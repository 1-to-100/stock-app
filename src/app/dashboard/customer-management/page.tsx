"use client";

import * as React from "react";
import type { Metadata } from "next";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Table from "@mui/joy/Table";
import Checkbox from "@mui/joy/Checkbox";
import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft";
import { ArrowsDownUp as SortIcon } from "@phosphor-icons/react/dist/ssr/ArrowsDownUp";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { config } from "@/config";
import DeleteDeactivateUserModal from "@/components/dashboard/modals/DeleteDeactivateUserModal";
import UserDetailsPopover from "@/components/dashboard/user-management/user-details-popover";
import { useState, useCallback, useEffect } from "react";
import AddEditCustomer from "@/components/dashboard/modals/AddEditCustomerModal";
import Pagination from "@/components/dashboard/layout/pagination";
import Filter from "@/components/dashboard/filter";
import { Popper } from "@mui/base/Popper";
import SearchInput from "@/components/dashboard/layout/search-input";
import { useQuery } from "@tanstack/react-query";
import { getCustomersList, deleteCustomer } from "../../../lib/api/customers";
import { Customer } from "@/contexts/auth/types";
import CircularProgress from "@mui/joy/CircularProgress";
import { paths } from "@/paths";
import { useRouter } from "next/navigation";

interface HttpError extends Error {
  response?: {
    status: number;
  };
}

const metadata = {
  title: `Customer Management | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
  const [openAddCustomerModal, setopenAddCustomerModal] = useState(false);
  const [customerToEditId, setCustomerToEditId] = useState<number | null>(null);

  const [sortColumn, setSortColumn] = useState<keyof Customer | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<{
    managerId: number[];
    subscriptionId: number[];
    statusId: string[];
  }>({
    managerId: [],
    subscriptionId: [],
    statusId: [],
  });

  const router = useRouter();
  const rowsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "customers",
      currentPage,
      searchTerm,
      sortColumn,
      sortDirection,
      filters.managerId,
      filters.subscriptionId,
      filters.statusId,
    ],
    queryFn: async () => {
      const response = await getCustomersList({
        page: currentPage,
        perPage: rowsPerPage,
        search: searchTerm || undefined,
        orderBy: sortColumn || undefined,
        orderDirection: sortDirection,
        managerId: filters.managerId.length > 0 ? filters.managerId : undefined,
        subscriptionId: filters.subscriptionId.length > 0 ? filters.subscriptionId : undefined,
        statusId: filters.statusId.length > 0 ? filters.statusId : undefined,
      });
      return {
        ...response,
        data: response.data.map((customer) => ({
          ...customer,
          numberOfUsers: customer.numberOfUsers || 0,
          subscriptionId: customer.subscriptionId || 0,
          status: customer.status || "inactive",
          email: customer.email || "",
        })),
      };
    },
  });

  const customers = data?.data || [];
  const totalPages = data?.meta?.lastPage || 1;
  const hasResults = customers.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (anchorEl && !anchorEl.contains(event.target as Node)) {
        handleMenuClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl]);

  useEffect(() => {}, [popoverAnchorEl, selectedUser]);

  const handleRowCheckboxChange = (userId: number) => {
    setSelectedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!hasResults) return;
    if (event.target.checked) {
      setSelectedRows(customers.map((customer) => customer.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setRowsToDelete(selectedRows);
      setOpenDeleteModal(true);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setRowsToDelete([userId]);
    setOpenDeleteModal(true);
  };

  const handleDeleteRow = useCallback((customerId: number) => {
    setRowsToDelete([customerId]);
    setOpenDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    try {
      await Promise.all(
        rowsToDelete.map((id) => deleteCustomer(id))
      );
      
      setOpenDeleteModal(false);
      setRowsToDelete([]);
      setSelectedRows([]);
    } catch (error) {
      console.error('Failed to delete customers:', error);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuRowIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowIndex(null);
  };

  const handleOpenDetail = async (
    event: React.MouseEvent<HTMLElement>,
    customerId: number
  ) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(
      paths.dashboard.customerManagement.details(customerId.toString())
    );
    handleMenuClose();
  };

  const handleEdit = async (userId: number) => {
    try {
      setCustomerToEditId(userId);
      setOpenEditCustomerModal(true);
    } catch (err) {
      // Handle error
    }
    handleMenuClose();
  };

  const handleAddUser = () => {
    setopenAddCustomerModal(true);
    handleMenuClose();
  };

  const handleCloseEditModal = () => {
    setOpenEditCustomerModal(false);
    setCustomerToEditId(null);
  };

  const handleCloseAddUserModal = () => {
    setopenAddCustomerModal(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]);
  };

  const handleFilter = (filters: {
    managerId: number[];
    subscriptionId: number[];
    statusId: string[];
  }) => {
    setFilters(filters);
    setCurrentPage(1);
  };

  const handleSort = (column: keyof Customer) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const customersToDelete = rowsToDelete
    .map((customerId) => {
      const customer = customers.find((u) => u.id === customerId);
      return customer ? customer.name : undefined;
    })
    .filter((name): name is string => name !== undefined);

  const menuItemStyle = {
    padding: "8px 16px",
    fontSize: "16px",
    fontWeight: "400",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "var(--joy-palette-text-primary)",
    "&:hover": { backgroundColor: "var(--joy-palette-background-mainBg)" },
  };

  const iconStyle = {
    marginRight: "14px",
  };

  if (error) {
    const httpError = error as HttpError;
    if (httpError.response?.status === 403) {
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
  }

  return (
    <Box sx={{ p: "var(--Content-padding)" }}>
      <SearchInput
        onSearch={handleSearch}
        style={{ position: "fixed", top: "4%", zIndex: "1000" }}
      />
      <Stack spacing={3}>
        <Stack
          direction={{ lg: "row" }}
          spacing={3}
          sx={{ alignItems: "flex-start" }}
        >
          <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
            <Typography fontSize={{ xs: "xl3", lg: "xl3" }} level="h1">
              Customer Management
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            {selectedRows.length > 0 ? (
              <>
                <Box
                  sx={{
                    borderRight: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    paddingRight: "16px",
                    gap: "12px",
                  }}
                >
                  <Typography level="body-sm">
                    {selectedRows.length} row
                    {selectedRows.length > 1 ? "s" : ""} selected
                  </Typography>
                  <IconButton
                    onClick={handleDelete}
                    sx={{
                      bgcolor: "#FEE2E2",
                      color: "#EF4444",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                      "&:hover": {
                        bgcolor: "#FECACA",
                      },
                    }}
                  >
                    <TrashIcon fontSize="var(--Icon-fontSize)" />
                  </IconButton>
                </Box>
              </>
            ) : null}
            <Filter customers={customers} onFilterCustomers={handleFilter} />
            <Button
              variant="solid"
              color="primary"
              onClick={handleAddUser}
              startDecorator={<PlusIcon fontSize="var(--Icon-fontSize)" />}
            >
              Add customer
            </Button>
          </Stack>
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
        ) : (
          <>
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box>
                <Table aria-label="user management table">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>
                        <Checkbox
                          checked={
                            hasResults &&
                            selectedRows.length === customers.length
                          }
                          indeterminate={
                            hasResults &&
                            selectedRows.length > 0 &&
                            selectedRows.length < customers.length
                          }
                          onChange={handleSelectAllChange}
                          disabled={!hasResults}
                        />
                      </th>
                      <th
                        style={{ width: "30%" }}
                        onClick={() => handleSort("name")}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            "& .sort-icon": {
                              opacity: 0,
                              transition: "opacity 0.2s ease-in-out",
                            },
                            "&:hover .sort-icon": {
                              opacity: 1,
                            },
                          }}
                        >
                          Customer
                          <SortIcon
                            className="sort-icon"
                            fontSize="16"
                            color="var(--joy-palette-text-secondary)"
                          />
                        </Box>
                      </th>
                      <th
                        style={{ width: "25%" }}
                        onClick={() => handleSort("managerId")}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            "& .sort-icon": {
                              opacity: 0,
                              transition: "opacity 0.2s ease-in-out",
                            },
                            "&:hover .sort-icon": {
                              opacity: 1,
                            },
                          }}
                        >
                          Manager
                          <SortIcon
                            className="sort-icon"
                            fontSize="16"
                            color="var(--joy-palette-text-secondary)"
                          />
                        </Box>
                      </th>
                      <th
                        style={{ width: "20%" }}
                        onClick={() => handleSort("numberOfUsers")}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            "& .sort-icon": {
                              opacity: 0,
                              transition: "opacity 0.2s ease-in-out",
                            },
                            "&:hover .sort-icon": {
                              opacity: 1,
                            },
                          }}
                        >
                          Number of users
                          <SortIcon
                            className="sort-icon"
                            fontSize="16"
                            color="var(--joy-palette-text-secondary)"
                          />
                        </Box>
                      </th>
                      <th
                        style={{ width: "20%" }}
                        onClick={() => handleSort("subscriptionId")}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            "& .sort-icon": {
                              opacity: 0,
                              transition: "opacity 0.2s ease-in-out",
                            },
                            "&:hover .sort-icon": {
                              opacity: 1,
                            },
                          }}
                        >
                          Subscription
                          <SortIcon
                            className="sort-icon"
                            fontSize="16"
                            color="var(--joy-palette-text-secondary)"
                          />
                        </Box>
                      </th>
                      <th style={{ width: "5%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          <Typography level="body-md" color="neutral">
                            No items found
                          </Typography>
                        </td>
                      </tr>
                    ) : (
                      customers.map((customer, index) => (
                        <tr key={customer.id}>
                          <td>
                            <Checkbox
                              checked={selectedRows.includes(customer.id)}
                              onChange={() =>
                                handleRowCheckboxChange(customer.id)
                              }
                            />
                          </td>
                          <td>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "center" }}
                            >
                              <Typography sx={{ wordBreak: "break-all" }}>
                                {customer.name.slice(0, 85)}
                              </Typography>
                              <Tooltip
                                title={customer.status}
                                placement="top"
                                sx={{
                                  background: "#DAD8FD",
                                  color: "#3D37DD",
                                  textTransform: "capitalize",
                                }}
                              >
                                <Box
                                  sx={{
                                    bgcolor:
                                      customer.status === "active"
                                        ? "#1A7D36"
                                        : customer.status === "inactive"
                                        ? "#D3232F"
                                        : "#FAE17D",
                                    borderRadius: "50%",
                                    width: "10px",
                                    minWidth: "10px",
                                    height: "10px",
                                    display: "inline-block",
                                  }}
                                />
                              </Tooltip>
                            </Stack>
                          </td>
                          <td>
                            <Box
                              sx={{
                                position: "relative",
                                display: "inline-block",
                                fontWeight: 400,
                                color: "var(--joy-palette-text-secondary)",
                                wordBreak: "break-all",
                              }}
                            >
                              {typeof customer.manager?.name === "string"
                                ? customer.manager?.name.slice(0, 75)
                                : customer.manager?.name} <br />
                              {typeof customer.manager?.email === "string"
                                ? customer.manager?.email.slice(0, 75)
                                : customer.manager?.email}
                            </Box>
                          </td>
                          <td
                            style={{
                              fontWeight: 400,
                              color: "var(--joy-palette-text-secondary)",
                            }}
                          >
                            {customer?.numberOfUsers}
                          </td>
                          <td
                            style={{
                              color: "var(--joy-palette-text-secondary)",
                            }}
                          >
                            <Box
                              sx={{
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontWeight: 500,
                                fontSize: "12px",
                                width: "fit-content",
                                color:
                                  customer.subscriptionName === "Premium"
                                    ? "#3D37DD"
                                    : customer.subscriptionName === "Enterprise"
                                    ? "#4D2D00"
                                    : "#272930",
                                bgcolor:
                                  customer.subscriptionName === "Premium"
                                    ? "#DAD8FD"
                                    : customer.subscriptionName === "Enterprise"
                                    ? "#FFF8C5"
                                    : "#EEEFF0",
                              }}
                            >
                              {customer?.subscriptionName}
                            </Box>
                          </td>
                          <td>
                            <IconButton
                              size="sm"
                              onClick={(event) => {
                                handleMenuOpen(event, index);
                              }}
                            >
                              <DotsThreeVertical
                                weight="bold"
                                size={22}
                                color="var(--joy-palette-text-secondary)"
                              />
                            </IconButton>
                            <Popper
                              open={menuRowIndex === index && Boolean(anchorEl)}
                              anchorEl={anchorEl}
                              placement="bottom-start"
                              style={{
                                minWidth: "150px",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                backgroundColor:
                                  "var(--joy-palette-background-surface)",
                                zIndex: 1300,
                                border: "1px solid var(--joy-palette-divider)",
                              }}
                            >
                              <Box
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  handleEdit(customer.id);
                                }}
                                sx={menuItemStyle}
                              >
                                <PencilIcon fontSize="20px" style={iconStyle} />
                                Edit
                              </Box>
                              <Box
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  handleOpenDetail(event, customer.id);
                                }}
                                sx={menuItemStyle}
                              >
                                <EyeIcon fontSize="20px" style={iconStyle} />
                                View details
                              </Box>
                              {/* <Box
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  handleDeleteRow(customer.id);
                                  handleMenuClose();
                                }}
                                sx={{ ...menuItemStyle, color: "#EF4444" }}
                              >
                                <TrashIcon fontSize="20px" style={iconStyle} />
                                Delete
                              </Box> */}
                            </Popper>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Box>
            </Box>
          </>
        )}

        {(customers.length > 0 || isLoading) && (
          <Box
            // sx={{
            //   position: "fixed",
            //   bottom: "30px",
            //   left: 0,
            //   right: 0,
            //   zIndex: 1000,
            //   padding: "12px 24px",
            //   display: "flex",
            //   justifyContent: "center",
            // }}
          >
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              disabled={!hasResults}
            />
          </Box>
        )}
      </Stack>

      <DeleteDeactivateUserModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        usersToDelete={customersToDelete}
      />

      <AddEditCustomer
        open={openEditCustomerModal}
        onClose={handleCloseEditModal}
        customerId={customerToEditId}
      />

      <AddEditCustomer
        open={openAddCustomerModal}
        onClose={handleCloseAddUserModal}
      />
    </Box>
  );
}
