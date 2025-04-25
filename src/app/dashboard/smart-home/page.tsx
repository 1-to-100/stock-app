"use client";

import * as React from "react";
import type { Metadata } from "next";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Table from "@mui/joy/Table";
import Checkbox from "@mui/joy/Checkbox";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { Copy as CopyIcon } from "@phosphor-icons/react/dist/ssr/Copy";
import { X as X } from "@phosphor-icons/react/dist/ssr/X";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { Password } from "@phosphor-icons/react/dist/ssr/Password";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft";
import { ArrowsDownUp as SortIcon } from "@phosphor-icons/react/dist/ssr/ArrowsDownUp";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { config } from "@/config";
import DeleteDeactivateUserModal from "@/components/dashboard/modals/DeleteDeactivateUserModal";
import UserDetailsPopover from "@/components/dashboard/smart-home/user-details-popover";
import { useState, useCallback, useEffect } from "react";
import AddEditUser from "@/components/dashboard/modals/AddEditUser";
import Pagination from "@/components/dashboard/layout/pagination";
import ResetPasswordUser from "@/components/dashboard/modals/ResetPasswordUserModal";
import UserManagementFilter from "@/components/dashboard/smart-home/user-management-filter";
import { Popper } from "@mui/base/Popper";
import SearchInput from "@/components/dashboard/layout/search-input";
import { useQuery } from "@tanstack/react-query";
import { getUsers, getUserById } from "../../../lib/api/users";
import { getRoles } from "./../../../lib/api/roles";
import { getCustomers } from "./../../../lib/api/customers";
import { ApiUser } from "@/contexts/auth/types";
import CircularProgress from "@mui/joy/CircularProgress";

interface HttpError extends Error {
  response?: {
    status: number;
  };
}

const metadata = {
  title: `User Management | Dashboard | ${config.site.name}`,
} satisfies Metadata;


export default function Page(): React.JSX.Element {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [userToEditId, setUserToEditId] = useState<number | null>(null);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<ApiUser | null>(
    null
  );
  const [sortColumn, setSortColumn] = useState<keyof ApiUser | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const rowsPerPage = 10;

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const transformUser = (apiUser: ApiUser): ApiUser => {
    const customer = customers?.find((c) => c.id === apiUser.customerId);
    const role = roles?.find((r) => r.id === apiUser.roleId);
    return {
      managerId: apiUser.managerId,
      id: apiUser.id,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
      email: apiUser.email,
      customerId: apiUser.customerId,
      customer: customer || apiUser.customer,
      roleId: apiUser.roleId,
      role: role || apiUser.role,
      persona: apiUser.persona || "",
      status: apiUser.status,
      avatar: apiUser.avatar || undefined,
      activity: apiUser.activity,
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "users",
      currentPage,
      searchTerm,
      sortColumn,
      sortDirection,
      roles,
      customers,
    ],
    queryFn: async () => {
      const response = await getUsers({
        page: currentPage,
        perPage: rowsPerPage,
        search: searchTerm || undefined,
        orderBy: sortColumn || undefined,
        orderDirection: sortDirection,
      });
      return {
        ...response,
        data: response.data.map(transformUser),
      };
    },
    enabled: !isRolesLoading && !isCustomersLoading,
  });

  const users = data?.data || [];
  const totalPages = data?.meta?.lastPage || 1;
  const hasResults = users.length > 0;

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
      setSelectedRows(users.map((user) => user.id));
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

  const handleDeleteRow = useCallback((userId: number) => {
    setRowsToDelete([userId]);
    setOpenDeleteModal(true);
  }, []);

  const handleDeactivate = (userId: number) => {
    setRowsToDelete([userId]);
    setIsDeactivating(true);
    setOpenDeactivateModal(true);
    handleMenuClose();
  };

  const handleBulkDeactivate = () => {
    if (selectedRows.length > 0) {
      setRowsToDelete(selectedRows);
      setIsDeactivating(true);
      setOpenDeactivateModal(true);
    }
  };

  const confirmDelete = () => {
    setOpenDeleteModal(false);
    setRowsToDelete([]);
    setSelectedRows([]);
  };

  const confirmDeactivate = () => {
    setOpenDeactivateModal(false);
    setRowsToDelete([]);
    setSelectedRows([]);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    });
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

  const handleClosePopover = () => {
    setSelectedUser(null);
    setPopoverAnchorEl(null);
  };

  const handleOpenDetail = async (
    event: React.MouseEvent<HTMLElement>,
    userId: number
  ) => {
    event.preventDefault();
    event.persist();
    const targetElement = event.currentTarget;
    try {
      const userData = await getUserById(userId);
      const transformedUser = transformUser(userData);
      setSelectedUser(transformedUser);
      setPopoverAnchorEl(targetElement);
    } catch (err) {
      // Handle error
    }
    handleMenuClose();
  };

  const handleEdit = async (userId: number) => {
    try {
      setUserToEditId(userId);
      setOpenEditModal(true);
    } catch (err) {
      // Handle error
    }
    handleMenuClose();
  };

  const handleAddUser = () => {
    setOpenAddUserModal(true);
    handleMenuClose();
  };

  // const handleResetPassword = (userId: number) => {
  //   const user = users.find((u) => u.id === userId);
  //   if (user) {
  //     setUserToResetPassword(user);
  //     setOpenResetPasswordModal(true);
  //   }
  //   handleMenuClose();
  // };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setUserToEditId(null);
  };

  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]);
  };

  const handleFilter = (_filtered: ApiUser[], _filtersApplied: boolean) => {
    setCurrentPage(1);
  };

  const handleSort = (column: keyof ApiUser) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const usersToDelete = rowsToDelete
    .map((userId) => {
      const user = users.find((u) => u.id === userId);
      return user ? user.name : undefined;
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
    return (
      <Typography>Error loading users: {error.message}</Typography>
    );
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
              User Management
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
                  <IconButton
                    onClick={handleBulkDeactivate}
                    sx={{
                      bgcolor: "var(--joy-palette-background-mainBg)",
                      color: "#636B74",
                      borderRadius: "50%",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <ToggleLeft fontSize="var(--Icon-fontSize)" />
                  </IconButton>
                </Box>
              </>
            ) : null}
            <UserManagementFilter users={users} onFilter={handleFilter} />
            <Button
              variant="solid"
              color="primary"
              onClick={handleAddUser}
              startDecorator={<PlusIcon fontSize="var(--Icon-fontSize)" />}
            >
              Add user
            </Button>
          </Stack>
        </Stack>

        {isLoading || isRolesLoading || isCustomersLoading ? (
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
                            hasResults && selectedRows.length === users.length
                          }
                          indeterminate={
                            hasResults &&
                            selectedRows.length > 0 &&
                            selectedRows.length < users.length
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
                          User name
                          <SortIcon
                            className="sort-icon"
                            fontSize="16"
                            color="var(--joy-palette-text-secondary)"
                          />
                        </Box>
                      </th>
                      <th
                        style={{ width: "25%" }}
                        onClick={() => handleSort("email")}
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
                          Email
                          <SortIcon
                            className="sort-icon"
                            fontSize="16"
                            color="var(--joy-palette-text-secondary)"
                          />
                        </Box>
                      </th>
                      <th
                        style={{ width: "20%" }}
                        onClick={() => handleSort("customer")}
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
                        style={{ width: "20%" }}
                        onClick={() => handleSort("role")}
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
                          Role
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
                    {users.length === 0 ? (
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
                      users.map((user, index) => (
                        <tr
                          key={user.id}
                          onMouseEnter={() => setHoveredRow(index)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td>
                            <Checkbox
                              checked={selectedRows.includes(user.id)}
                              onChange={() => handleRowCheckboxChange(user.id)}
                            />
                          </td>
                          <td>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "center" }}
                            >
                              {user.avatar ? (
                                <Avatar
                                  src={user.avatar}
                                  sx={{ width: 28, height: 28 }}
                                />
                              ) : (
                                <Avatar sx={{ width: 28, height: 28 }} />
                              )}
                              <Typography sx={{ wordBreak: "break-all" }}>
                                {user.name.slice(0, 85)}
                              </Typography>
                              <Tooltip
                                title={user.status}
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
                                      user.status === "active"
                                        ? "#1A7D36"
                                        : user.status === "inactive"
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
                              {typeof user.email === "string"
                                ? user.email.slice(0, 75)
                                : user.email[0]}
                              {hoveredRow === index && (
                                <Tooltip
                                  title="Copy Email"
                                  placement="top"
                                  sx={{
                                    background: "#DAD8FD",
                                    color: "#3D37DD",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  <IconButton
                                    size="sm"
                                    onClick={() => {
                                      if (typeof user.email === "string") {
                                        handleCopyEmail(user.email);
                                      }
                                    }}
                                    sx={{
                                      position: "absolute",
                                      right: "-30px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      bgcolor: "transparent",
                                      "&:hover": {
                                        bgcolor: "transparent",
                                      },
                                    }}
                                  >
                                    <CopyIcon fontSize="var(--Icon-fontSize)" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {copiedEmail === user.email && (
                                <Box
                                  sx={{
                                    position: "fixed",
                                    bottom: "20px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    bgcolor: "#DCFCE7",
                                    color: "#16A34A",
                                    padding: "4px 6px",
                                    borderRadius: "10px",
                                    fontSize: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    zIndex: 1000,
                                  }}
                                >
                                  Copied to clipboard
                                  <IconButton
                                    size="sm"
                                    onClick={() => setCopiedEmail(null)}
                                    sx={{ color: "#16A34A" }}
                                  >
                                    <X fontSize="var(--Icon-fontSize)" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </td>
                          <td
                            style={{
                              fontWeight: 400,
                              color: "var(--joy-palette-text-secondary)",
                            }}
                          >
                            {user.customer?.name}
                          </td>
                          <td
                            style={{
                              color: "var(--joy-palette-text-secondary)",
                            }}
                          >
                            {user.role?.name}
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
                                  handleOpenDetail(event, user.id);
                                }}
                                sx={menuItemStyle}
                              >
                                <EyeIcon fontSize="20px" style={iconStyle} />
                                Open detail
                              </Box>
                              <Box
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  handleEdit(user.id);
                                }}
                                sx={menuItemStyle}
                              >
                                <PencilIcon fontSize="20px" style={iconStyle} />
                                Edit
                              </Box>
                            </Popper>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Box>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                disabled={!hasResults}
              />
            </Box>
          </>
        )}
      </Stack>

      <DeleteDeactivateUserModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        usersToDelete={usersToDelete}
      />

      <DeleteDeactivateUserModal
        open={openDeactivateModal}
        onClose={() => setOpenDeactivateModal(false)}
        onConfirm={confirmDeactivate}
        usersToDelete={usersToDelete}
        isDeactivate={true}
      />

      <UserDetailsPopover
        open={Boolean(popoverAnchorEl)}
        onClose={handleClosePopover}
        anchorEl={popoverAnchorEl}
        user={selectedUser}
      />

      <AddEditUser
        open={openEditModal}
        onClose={handleCloseEditModal}
        userId={userToEditId}
      />

      <AddEditUser open={openAddUserModal} onClose={handleCloseAddUserModal} />

      <ResetPasswordUser
        open={openResetPasswordModal}
        onClose={() => setOpenResetPasswordModal(false)}
        userName={userToResetPassword?.name || ""}
        userEmail={userToResetPassword?.email || ""}
        onConfirm={(selectedEmail) => {
          console.log(`Resetting password for ${selectedEmail}`);
        }}
      />
    </Box>
  );
}