"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Table from "@mui/joy/Table";
import { Plus, Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { paths } from "@/paths";
import {
  Avatar,
  Breadcrumbs,
  Checkbox,
  CircularProgress,
  ColorPaletteProp,
  Stack,
  VariantProp,
} from "@mui/joy";
import { BreadcrumbsItem } from "@/components/core/breadcrumbs-item";
import { BreadcrumbsSeparator } from "@/components/core/breadcrumbs-separator";
import SearchInput from "@/components/dashboard/layout/search-input";
import { Popper } from "@mui/base/Popper";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { Password } from "@phosphor-icons/react/dist/ssr/Password";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { useCallback, useState, useEffect } from "react";
import UserDetailsPopover from "@/components/dashboard/user-management/user-details-popover";
import AddEditUser from "@/components/dashboard/modals/AddEditUser";
import DeleteDeactivateUserModal from "@/components/dashboard/modals/DeleteItemModal";
import Pagination from "@/components/dashboard/layout/pagination";
import ResetPasswordUser from "@/components/dashboard/modals/ResetPasswordUserModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserById } from "../../../../lib/api/users";
import { getRoles, ModulePermission } from "../../../../lib/api/roles";
import { getCustomers } from "../../../../lib/api/customers";
import { getRoleById } from "../../../../lib/api/roles";
import { ApiUser } from "@/contexts/auth/types";
import AddRoleModal from "@/components/dashboard/modals/AddRoleModal";
import { getCategoryById } from "@/lib/api/categories";

const RouterLink = Link;

interface Permission {
  id: string;
  name: string;
  label: string;
  description?: string;
}

interface Module {
  id: string;
  name: string;
  permissions: Permission[];
}

const SystemAdminSettings: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [expandedPermissions, setExpandedPermissions] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addUserAnchorEl, setAddUserAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openEditRoleModal, setOpenEditRoleModal] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [userToResetPassword, setUserToResetPassword] =
    useState<ApiUser | null>(null);
  const [userToEditId, setUserToEditId] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof ApiUser | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryClient = useQueryClient();
  const params = useParams();
  const categoryId = params.categoryId;

  const rowsPerPage = 10;

  const {
    data: roleData,
    isLoading: isRoleLoading,
    error: roleError,
  } = useQuery({
    queryKey: ["role", categoryId],
    queryFn: () => {
      if (!categoryId) {
        throw new Error("Role ID is missing");
      }
      return getCategoryById(Number(categoryId));
    },
    enabled: !!categoryId,
  });

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
      createdAt: apiUser.createdAt,
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "users",
      currentPage,
      searchTerm,
      sortColumn,
      sortDirection,
      categoryId,
      customers,
    ],
    queryFn: async () => {
      const response = await getUsers({
        page: currentPage,
        perPage: rowsPerPage,
        search: searchTerm || undefined,
        orderBy: sortColumn || undefined,
        orderDirection: sortDirection,
        roleId: categoryId ? [Number(categoryId)] : undefined,
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
      if (addUserAnchorEl && !addUserAnchorEl.contains(event.target as Node)) {
        handleAddUserMenuClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl, addUserAnchorEl]);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };


  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuRowIndex(index);
  };

  const handleAddUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAddUserAnchorEl(event.currentTarget);
  };

  const handleAddUserMenuClose = () => {
    setAddUserAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowIndex(null);
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
      console.error("Error fetching user details:", err);
    }
    handleMenuClose();
  };

  const handleClosePopover = () => {
    setSelectedUser(null);
    setPopoverAnchorEl(null);
  };

  const handleEdit = (userId: number) => {
    setUserToEditId(userId);
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleAddUser = () => {
    setOpenAddUserModal(true);
    handleAddUserMenuClose();
  };

  const handleEditRole = () => {
    setOpenEditRoleModal(true);
  };

  const handleResetPassword = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToResetPassword(user);
      setOpenResetPasswordModal(true);
    }
    handleMenuClose();
  };

  const handleDeleteRow = useCallback((userId: number) => {
    setRowsToDelete([userId]);
    setOpenDeleteModal(true);
  }, []);

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setRowsToDelete(selectedRows);
      setOpenDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    setOpenDeleteModal(false);
    setRowsToDelete([]);
    setSelectedRows([]);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setUserToEditId(null);
  };

  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
  };

  const handleCloseEditRoleModal = () => {
    setOpenEditRoleModal(false);
  };

  const handleRoleEdited = async () => {
    if (categoryId) {
      await queryClient.invalidateQueries({
        queryKey: ["role", categoryId],
      });
    }
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]);
  };

  const handleSort = (column: keyof ApiUser) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    });
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

  const avatarColors: ColorPaletteProp[] = [
    "primary",
    "neutral",
    "danger",
    "warning",
    "success",
  ];

  const getAvatarProps = (name: string) => {
    const hash = Array.from(name).reduce(
      (acc: number, char: string) => acc + char.charCodeAt(0),
      0
    );
    const colorIndex = hash % avatarColors.length;
    return {
      color: avatarColors[colorIndex],
      variant: "soft" as VariantProp,
    };
  };

  if (roleError || error) {
    return <Typography>Error: {(roleError || error)?.message}</Typography>;
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
          <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
            <Typography
              fontSize={{ xs: "xl2", sm: "xl3" }}
              level="h1"
              sx={{ wordBreak: "break-word" }}
            >
              {roleData?.name}
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              alignItems: { xs: "stretch", sm: "center" },
              width: { xs: "100%", sm: "auto" },
              position: "relative",
            }}
          >
            <Button
              sx={{
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1, sm: 0.75 },
              }}
              variant="outlined"
              color="primary"
              onClick={handleEditRole}
              startDecorator={<PencilIcon fontSize="var(--Icon-fontSize)" />}
            >
              Edit
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={handleAddUser}
              startDecorator={<PlusIcon fontSize="var(--Icon-fontSize)" />}
              sx={{
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1, sm: 0.75 },
              }}
            >
              Add user
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ mt: 4 }}>
        <Breadcrumbs separator={<BreadcrumbsSeparator />}>
          <BreadcrumbsItem
            href={paths.dashboard.roleSettings.list}
            type="start"
          />
          <BreadcrumbsItem href={paths.dashboard.documentation.list}>
            Documentation
          </BreadcrumbsItem>
          <BreadcrumbsItem type="end">{roleData?.name}</BreadcrumbsItem>
        </Breadcrumbs>
      </Stack>

      <Box
        sx={{
          display: { xs: "block", sm: "flex" },
          gap: 3,
          mb: 6,
        }}
      >
        <Box
          sx={{
            flex: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              mt: 2,
            }}
          >
            <Stack sx={{ alignItems: "center", ml: "auto", mr: 2 }}>
              {selectedRows.length > 0 ? (
                <Box
                  sx={{
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
                      "&:hover": { bgcolor: "#FECACA" },
                    }}
                  >
                    <TrashIcon fontSize="var(--Icon-fontSize)" />
                  </IconButton>
                </Box>
              ) : null}
            </Stack>
          </Box>

          {isLoading ||
          isRoleLoading ||
          isRolesLoading ||
          isCustomersLoading ? (
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
            <Box>
              {users.length === 0 ? (
                <Box sx={{ textAlign: "center", mt: "150px" }}>
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "var(--joy-palette-text-primary)",
                    }}
                  >
                    You do not have any articles
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "300",
                      color: "var(--joy-palette-text-secondary)",
                      mt: 1,
                    }}
                  >
                    Add articles avialable for this category.
                  </Typography>
                  <Button
                    onClick={handleAddUser}
                    variant="outlined"
                    startDecorator={<Plus size={20} weight="bold" />}
                    sx={{ mt: 2, color: "var(--joy-palette-text-secondary)" }}
                  >
                    Add user
                  </Button>
                  <AddEditUser
                    open={openAddUserModal}
                    onClose={handleCloseAddUserModal}
                  />
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      overflowX: "auto",
                      width: "100%",
                      WebkitOverflowScrolling: "touch",
                      scrollbarWidth: { xs: "thin", sm: "auto" },
                      "&::-webkit-scrollbar": {
                        height: { xs: "8px", sm: "12px" },
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--joy-palette-divider)",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    <Table
                      aria-label="system admin users table"
                      sx={{
                        minWidth: "400px",
                        tableLayout: "fixed",
                        "& th, & td": {
                          px: { xs: 1, sm: 2 },
                          py: { xs: 1, sm: 1.5 },
                        },
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "5%" }}>
                            <Checkbox
                              checked={
                                hasResults &&
                                selectedRows.length === users.length
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
                          <th style={{ width: "30%" }}>Article name</th>
                          <th style={{ width: "10%" }}>Last edit</th>
                          <th style={{ width: "10%" }}>Status</th>
                          <th
                            onClick={() => handleSort("name")}
                            style={{ width: "25%" }}
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
                                "&:hover .sort-icon": { opacity: 1 },
                              }}
                            >
                              Author
                            </Box>
                          </th>
                          <th onClick={() => handleSort("email")}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                "& .sort-icon": {
                                  opacity: 0,
                                  transition: "opacity 0.2s ease-in-out",
                                },
                                "&:hover .sort-icon": { opacity: 1 },
                              }}
                            >
                              Perfomance
                            </Box>
                          </th>
                          <th style={{ width: "60px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr
                            key={user.id}
                            onMouseEnter={() => setHoveredRow(index)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <td>
                              <Checkbox
                                checked={selectedRows.includes(user.id)}
                                onChange={() =>
                                  handleRowCheckboxChange(user.id)
                                }
                              />
                            </td>
                            <td></td>
                            <td></td>
                            <td>
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
                            </td>
                            <td>
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ alignItems: "center" }}
                              >
                                <Typography>
                                  {user.avatar ? (
                                    <Avatar
                                      src={user.avatar}
                                      sx={{ width: 28, height: 28 }}
                                    />
                                  ) : (
                                    <Avatar
                                      sx={{
                                        width: 28,
                                        height: 28,
                                        fontWeight: "bold",
                                        fontSize: "13px",
                                      }}
                                      {...getAvatarProps(user.name)}
                                    >
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </Avatar>
                                  )}
                                </Typography>
                                <Typography sx={{ wordBreak: "break-all" }}>
                                  {user.name.slice(0, 45)}
                                </Typography>
                              </Stack>
                            </td>
                            <td>
                              <Stack
                                direction="row"
                                sx={{ alignItems: "center" }}
                              >
                                <EyeIcon fontSize="18px" style={iconStyle} />
                                <Typography sx={{ wordBreak: "break-all" }}>
                                  {user.name.slice(0, 2)}
                                </Typography>
                              </Stack>
                            </td>
                            <td>
                              <IconButton
                                size="sm"
                                onClick={(event) =>
                                  handleMenuOpen(event, index)
                                }
                              >
                                <DotsThreeVertical
                                  weight="bold"
                                  size={22}
                                  color="var(--joy-palette-text-secondary)"
                                />
                              </IconButton>
                              <Popper
                                open={
                                  menuRowIndex === index && Boolean(anchorEl)
                                }
                                anchorEl={anchorEl}
                                placement="bottom-start"
                                style={{
                                  minWidth: "150px",
                                  borderRadius: "8px",
                                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                  backgroundColor:
                                    "var(--joy-palette-background-surface)",
                                  zIndex: 1300,
                                  border:
                                    "1px solid var(--joy-palette-divider)",
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
                                  <PencilIcon
                                    fontSize="20px"
                                    style={iconStyle}
                                  />
                                  Edit
                                </Box>
                                <Box
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                    handleResetPassword(user.id);
                                  }}
                                  sx={menuItemStyle}
                                >
                                  <Password fontSize="20px" style={iconStyle} />
                                  Reset password
                                </Box>
                                <Box
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                    handleDeleteRow(user.id);
                                    handleMenuClose();
                                  }}
                                  sx={{ ...menuItemStyle, color: "#EF4444" }}
                                >
                                  <TrashIcon
                                    fontSize="20px"
                                    style={iconStyle}
                                  />
                                  Delete
                                </Box>
                              </Popper>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {(users.length > 0 || isLoading) && (
                      <Box
                        sx={{
                          position: { xs: "static", sm: "static" },
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          padding: "12px 24px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Pagination
                          totalPages={totalPages}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                          disabled={!hasResults}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <DeleteDeactivateUserModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        usersToDelete={usersToDelete}
        title="Delete article"
        description="Are you sure you want to delete this article?"
      />

      <AddEditUser
        open={openEditModal}
        onClose={handleCloseEditModal}
        userId={userToEditId}
      />

      <AddEditUser open={openAddUserModal} onClose={handleCloseAddUserModal} />

      <AddRoleModal
        open={openEditRoleModal}
        onClose={handleCloseEditRoleModal}
        roleId={roleData?.id}
        onRoleCreated={handleRoleEdited}
      />

      <ResetPasswordUser
        open={openResetPasswordModal}
        onClose={() => setOpenResetPasswordModal(false)}
        userName={userToResetPassword?.name || ""}
        userEmail={userToResetPassword?.email || ""}
        onConfirm={(selectedEmail) => {
          console.log(`Resetting password for ${selectedEmail}`);
        }}
      />

      <UserDetailsPopover
        open={Boolean(popoverAnchorEl)}
        onClose={handleClosePopover}
        anchorEl={popoverAnchorEl}
        userId={selectedUser?.id ?? 0}
      />
    </Box>
  );
};

export default SystemAdminSettings;
