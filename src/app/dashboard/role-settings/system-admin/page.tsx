"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import Card from "@mui/joy/Card";
import Table from "@mui/joy/Table";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { paths } from "@/paths";
import { Avatar, Breadcrumbs, Checkbox, Stack } from "@mui/joy";
import { BreadcrumbsItem } from "@/components/core/breadcrumbs-item";
import { BreadcrumbsSeparator } from "@/components/core/breadcrumbs-separator";
import SearchInput from "@/components/dashboard/layout/search-input";
import { GridFour as GridFour } from "@phosphor-icons/react/dist/ssr/GridFour";
import { Table as TableIcon } from "@phosphor-icons/react/dist/ssr/Table";
import { CaretUp as CaretUp } from "@phosphor-icons/react/dist/ssr/CaretUp";
import { CaretDown as CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CheckCircle as CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Popper } from "@mui/base/Popper";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { Password } from "@phosphor-icons/react/dist/ssr/Password";
import { useCallback, useState } from "react";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import UserDetailsPopover from "@/components/dashboard/smart-home/user-details-popover";
import AddEditUser from "@/components/dashboard/modals/AddEditUser";
import DeleteDeactivateUserModal from "@/components/dashboard/modals/DeleteDeactivateUserModal";
import Pagination from "@/components/dashboard/layout/pagination";
import InviteUser from "@/components/dashboard/modals/InviteUserModal";

const RouterLink = Link;

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

interface Permission {
  id: string;
  name: string;
  description: string;
  access: "Full access" | "Limited access" | "No access";
}

interface Role {
  id: string;
  abbreviation: string;
  name: string;
  description: string;
  peopleCount: number;
}

const systemAdminUsers: User[] = [
  {
    id: 1,
    name: "Jannet Jones",
    email: "trungkienspktnd@gmail.com",
    customer: "StockHive",
    role: "Customer admin",
    persona: "Education",
    status: "suspended",
    avatar:
      "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg",
    activity: [
      {
        id: 0,
        browserOs: "Chrome, Mac OS 10.15.7",
        locationTime: "California, USA • May 08 10:40AM",
      },
      {
        id: 1,
        browserOs: "Firefox, Windows 10",
        locationTime: "Nevada, USA • May 09 2:15PM",
      },
      {
        id: 2,
        browserOs: "Chrome, Mac OS 10.15.7",
        locationTime: "California, USA • May 08 10:40AM",
      },
    ],
  },
  {
    id: 2,
    name: "Albert Flores",
    email: "nvt.isst.nute@gmail.com",
    customer: "TradeNest",
    role: "User",
    persona: "Titles",
    status: "active",
    activity: [
      {
        id: 0,
        browserOs: "Firefox, Windows 11",
        locationTime: "New York, USA • June 15 3:25PM",
      },
      {
        id: 1,
        browserOs: "Safari, iOS 16.0",
        locationTime: "Boston, USA • June 16 9:30AM",
      },
      {
        id: 2,
        browserOs: "Chrome, Android 12",
        locationTime: "Chicago, USA • June 17 11:45AM",
      },
    ],
  },
  {
    id: 3,
    name: "Devon Lane",
    email: "binhan628@gmail.com",
    customer: "TradeNest",
    role: "Customer admin",
    persona: "Experience",
    status: "active",
    avatar:
      "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
    activity: [
      {
        id: 0,
        browserOs: "Safari, iOS 16.2",
        locationTime: "London, UK • July 20 8:15AM",
      },
      {
        id: 1,
        browserOs: "Edge, Windows 11",
        locationTime: "Manchester, UK • July 21 3:00PM",
      },
    ],
  },
  {
    id: 4,
    name: "Floyd Miles",
    email: "danghoang87hl@gmail.com",
    customer: "TradeNest",
    role: "Customer admin",
    persona: "Responsibilities",
    status: "active",
    activity: [
      {
        id: 0,
        browserOs: "Edge, Windows 10",
        locationTime: "Tokyo, Japan • August 10 11:30PM",
      },
      {
        id: 1,
        browserOs: "Chrome, Mac OS 12.0",
        locationTime: "Osaka, Japan • August 11 10:00AM",
      },
    ],
  },
  {
    id: 5,
    name: "Eleanor Pena",
    email: "binhan628@gmail.com",
    customer: "MarketSphere",
    role: "Customer admin",
    persona: "Customer admin",
    status: "active",
    activity: [
      {
        id: 0,
        browserOs: "Chrome, Linux Ubuntu 20.04",
        locationTime: "Sydney, Australia • September 05 6:45AM",
      },
      {
        id: 1,
        browserOs: "Firefox, Windows 10",
        locationTime: "Melbourne, Australia • September 06 1:20PM",
      },
      {
        id: 2,
        browserOs: "Safari, iOS 15.5",
        locationTime: "Brisbane, Australia • September 07 4:30PM",
      },
    ],
  },
  {
    id: 6,
    name: "Courtney Henry",
    email: "tranthuy.nute@gmail.com",
    customer: "InvestHorizon",
    role: "User",
    persona: "User",
    status: "inactive",
    activity: [
      {
        id: 0,
        browserOs: "Opera, Mac OS 11.0",
        locationTime: "Berlin, Germany • October 12 2:10PM",
      },
      {
        id: 1,
        browserOs: "Chrome, Android 13",
        locationTime: "Munich, Germany • October 13 9:45AM",
      },
    ],
  },
  {
    id: 7,
    name: "Annette Black",
    email: "tranthuy.nute@gmail.com",
    customer: "InvestHorizon",
    role: "User",
    persona: "Education",
    status: "active",
    activity: [
      {
        id: 0,
        browserOs: "Chrome, Windows 10",
        locationTime: "Paris, France • November 18 9:50AM",
      },
      {
        id: 1,
        browserOs: "Safari, Mac OS 12.1",
        locationTime: "Lyon, France • November 19 3:15PM",
      },
    ],
  },
  {
    id: 8,
    name: "Brooklyn Simmons",
    email: "ckctm12@gmail.com",
    customer: "EquityVault",
    role: "User",
    persona: "Education",
    status: "active",
    activity: [
      {
        id: 0,
        browserOs: "Safari, Mac OS 12.1",
        locationTime: "Toronto, Canada • December 01 4:20PM",
      },
      {
        id: 1,
        browserOs: "Firefox, Windows 11",
        locationTime: "Vancouver, Canada • December 02 11:00AM",
      },
      {
        id: 2,
        browserOs: "Edge, Windows 10",
        locationTime: "Montreal, Canada • December 03 2:30PM",
      },
    ],
  },
  {
    id: 9,
    name: "Kristin Watson",
    email: "vuhaithuongnute@gmail.com",
    customer: "StockAnchor",
    role: "User",
    persona: "Education",
    status: "active",
    activity: [
      {
        id: 0,
        browserOs: "Firefox, Linux Mint 21",
        locationTime: "Stockholm, Sweden • January 10 11:15AM",
      },
      {
        id: 1,
        browserOs: "Chrome, Android 13",
        locationTime: "Gothenburg, Sweden • January 11 5:00PM",
      },
    ],
  },
  {
    id: 10,
    name: "Theresa Webb",
    email: "nvt.isst.nute@gmail.com",
    customer: "EquityVault",
    role: "User",
    persona: "Experience",
    status: "active",
    activity: [
      {
        id: 0,
        browserOs: "Chrome, Android 13",
        locationTime: "Mumbai, India • February 25 7:30PM",
      },
      {
        id: 1,
        browserOs: "Safari, iOS 16.1",
        locationTime: "Delhi, India • February 26 10:15AM",
      },
    ],
  },
  {
    id: 11,
    name: "Jane Cooper",
    email: "tranthuy.nute@gmail.com",
    customer: "BullBear Hub",
    role: "User",
    persona: "Experience",
    status: "inactive",
    activity: [
      {
        id: 0,
        browserOs: "Edge, Windows 11",
        locationTime: "São Paulo, Brazil • March 03 1:45PM",
      },
      {
        id: 1,
        browserOs: "Chrome, Mac OS 13.0",
        locationTime: "Rio de Janeiro, Brazil • March 04 9:20AM",
      },
      {
        id: 2,
        browserOs: "Firefox, Windows 10",
        locationTime: "Salvador, Brazil • March 05 3:50PM",
      },
    ],
  },
  {
    id: 12,
    name: "Arlene McCoy",
    email: "manhhackt08@gmail.com",
    customer: "BullBear Hub",
    role: "User",
    persona: "Titles",
    status: "inactive",
    activity: [
      {
        id: 0,
        browserOs: "Safari, iOS 15.6",
        locationTime: "Cape Town, South Africa • April 15 9:10AM",
      },
      {
        id: 1,
        browserOs: "Chrome, Windows 11",
        locationTime: "Johannesburg, South Africa • April 16 2:25PM",
      },
    ],
  },
  {
    id: 13,
    name: "Jerome Bell",
    email: "vuhaithuongnute@gmail.com",
    customer: "StockAnchor",
    role: "User",
    persona: "Titles",
    status: "inactive",
    activity: [
      {
        id: 0,
        browserOs: "Chrome, Mac OS 13.0",
        locationTime: "Moscow, Russia • May 22 5:55PM",
      },
      {
        id: 1,
        browserOs: "Firefox, Linux Ubuntu 22.04",
        locationTime: "St. Petersburg, Russia • May 23 11:30AM",
      },
    ],
  },
  {
    id: 14,
    name: "Marvin McKinney",
    email: "binhan628@gmail.com",
    customer: "StockAnchor",
    role: "User",
    persona: "Education",
    status: "inactive",
    activity: [],
  },
  {
    id: 15,
    name: "Leslie Alexander",
    email: "leslie.alex@gmail.com",
    customer: "MarketPulse",
    role: "Customer admin",
    persona: "Responsibilities",
    status: "active",
    activity: [
      {
        id: 0,
        browserOs: "Chrome, Ubuntu 22.04",
        locationTime: "Dubai, UAE • July 12 12:00PM",
      },
      {
        id: 1,
        browserOs: "Edge, Windows 11",
        locationTime: "Abu Dhabi, UAE • July 13 4:30PM",
      },
    ],
  },
];

const systemAdminRole: Role = {
  id: "role-1",
  abbreviation: "SA",
  name: "System Admin",
  description:
    "Admins have full access to the platform, just like owners. Reserved for founders and tech ops.",
  peopleCount: systemAdminUsers.length,
};

const permissions: Permission[] = [
  {
    id: "1",
    name: "User Management",
    description:
      "System Admin fully controls User Management, including creating, editing, and removing users across tenants, assigning roles, and managing permissions to ensure proper access levels.",
    access: "Full access",
  },
  {
    id: "2",
    name: "Customer Management",
    description: "Manage customer accounts and data",
    access: "Full access",
  },
  {
    id: "3",
    name: "Role & Personas Settings",
    description: "Configure roles and user personas",
    access: "Full access",
  },
  {
    id: "4",
    name: "Accounting",
    description: "Access to financial data and reports",
    access: "Full access",
  },
  {
    id: "5",
    name: "Documentation",
    description: "Access system documentation",
    access: "Full access",
  },
  {
    id: "6",
    name: "Help Centre",
    description: "Manage help and support resources",
    access: "Full access",
  },
];

const SystemAdminSettings: React.FC = () => {
  const [users, setUsers] = useState<User[]>(systemAdminUsers);
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [expandedPermissions, setExpandedPermissions] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const [addUserAnchorEl, setAddUserAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(
    null
  );
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openInviteUserModal, setOpenInviteUserModal] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);
  const hasResults = users.length > 0;

  const handleSearch = (searchTerm: string) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();

    const searchedUsers = systemAdminUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(trimmedSearch) ||
        (typeof user.email === "string" &&
          user.email.toLowerCase().includes(trimmedSearch)) ||
        user.customer.toLowerCase().includes(trimmedSearch) ||
        user.role.toLowerCase().includes(trimmedSearch) ||
        user.persona.toLowerCase().includes(trimmedSearch)
    );

    setUsers(searchedUsers);
    setCurrentPage(1);
  };

  const togglePermission = (id: string) => {
    setExpandedPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
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

  const handleOpenDetail = (
    event: React.MouseEvent<HTMLElement>,
    userId: number
  ) => {
    event.preventDefault();
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setPopoverAnchorEl(event.currentTarget);
    }
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowIndex(null);
  };

  const handleDeleteRow = useCallback((userId: number) => {
    setRowsToDelete([userId]);
    setOpenDeleteModal(true);
  }, []);

  const handleResetPassword = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToResetPassword(user);
      setOpenResetPasswordModal(true);
    }
    handleMenuClose();
  };

  const handleEdit = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToEdit(user);
      setOpenEditModal(true);
    }
    handleMenuClose();
  };

  const handleClosePopover = () => {
    setSelectedUser(null);
    setPopoverAnchorEl(null);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers((prevUsers) => {
      const userExists = prevUsers.some((user) => user.id === updatedUser.id);
      if (userExists) {
        return prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      } else {
        return [...prevUsers, updatedUser];
      }
    });

    if (selectedUser && selectedUser.id === updatedUser.id) {
      setSelectedUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
    setPopoverAnchorEl(null);
  };

  const confirmDelete = () => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !rowsToDelete.includes(user.id))
    );
    setSelectedRows([]);
    setRowsToDelete([]);
    setOpenDeleteModal(false);
  };

  const usersToDelete = rowsToDelete
    .map((userId) => {
      const user = users.find((u) => u.id === userId);
      return user ? user.name : undefined;
    })
    .filter((name): name is string => name !== undefined);

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setUserToEdit(undefined);
  };

  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
    setUserToEdit(undefined);
  };

  const handleCloseInviteUserModal = () => {
    setOpenInviteUserModal(false);
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
      setSelectedRows(currentUsers.map((user) => user.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]);
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setRowsToDelete(selectedRows);
      setOpenDeleteModal(true);
    }
  };

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

  return (
    <Box sx={{ padding: "24px" }}>
      <SearchInput
        onSearch={handleSearch}
        style={{ position: "fixed", top: "4%", zIndex: "1000" }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontSize={{ xs: "xl3", lg: "xl4" }} level="h1">
          {systemAdminRole.name}
        </Typography>
        <Box sx={{ position: "relative" }}>
          <Button
            startDecorator={<PlusIcon weight="bold" />}
            onClick={handleAddUserMenuOpen}
            sx={{
              backgroundColor: "#3E43DE",
              color: "white",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#3437B3" },
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Add user
          </Button>
          <Popper
            open={Boolean(addUserAnchorEl)}
            anchorEl={addUserAnchorEl}
            placement="bottom-end"
            style={{
              minWidth: "150px",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "var(--joy-palette-background-surface)",
              zIndex: 1300,
              border: "1px solid var(--joy-palette-divider)",
            }}
          >
            <Box
              onClick={() => {
                setOpenAddUserModal(true);
                handleAddUserMenuClose();
              }}
              sx={menuItemStyle}
            >
              <PlusIcon fontSize="20px" style={iconStyle} />
              Add user
            </Box>
            <Box
              onClick={() => {
                setOpenInviteUserModal(true);
                handleAddUserMenuClose();
              }}
              sx={menuItemStyle}
            >
              <UserIcon fontSize="20px" style={iconStyle} />
              Invite user
            </Box>
          </Popper>
        </Box>
      </Box>

      <Breadcrumbs separator={<BreadcrumbsSeparator />}>
        <BreadcrumbsItem
          href={paths.dashboard.roleSettings.list}
          type="start"
        />
        <BreadcrumbsItem href={paths.dashboard.roleSettings.list}>
          Role & Personas Settings
        </BreadcrumbsItem>
        <BreadcrumbsItem href={paths.dashboard.roleSettings.list}>
          Role Settings
        </BreadcrumbsItem>
        <BreadcrumbsItem type="end">System Admin</BreadcrumbsItem>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          borderTop: "1px solid var(--joy-palette-divider)",
          mt: 3,
          mb: 6,
        }}
      >
        <Box
          sx={{
            flex: 2,
            borderRight: "1px solid var(--joy-palette-divider)",
            pr: 3,
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
            <Typography
              level="title-md"
              sx={{ fontWeight: "500", fontSize: "18px" }}
            >
              Users who have access
            </Typography>
            <Stack sx={{ alignItems: "center", ml: "auto", mr: 2 }}>
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
              ) : null}{" "}
            </Stack>
            <Tabs
              value={viewMode}
              onChange={(event, newValue) =>
                setViewMode(newValue as "list" | "grid")
              }
              variant="custom"
            >
              <TabList
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 0,
                  "& .MuiTab-root": {
                    borderRadius: "20px",
                    minWidth: "40px",
                    p: 1,
                    color: "var(--joy-palette-text-secondary)",
                    "&[aria-selected='true']": {
                      border: "1px solid var(--joy-palette-divider)",
                      color: "var(--joy-palette-background-primaryColor)",
                      "& svg": {
                        fill: "url(#tab-gradient)",
                      },
                    },
                  },
                }}
              >
                <svg width="0" height="0">
                  <defs>
                    <linearGradient
                      id="tab-gradient"
                      gradientTransform="rotate(120)"
                    >
                      <stop offset="0%" stopColor="#282490" />
                      <stop offset="100%" stopColor="#3F4DCF" />
                    </linearGradient>
                  </defs>
                </svg>

                <Tab value="grid">
                  <GridFour size={20} weight="bold" />
                </Tab>
                <Tab value="list">
                  <TableIcon size={20} weight="bold" />
                </Tab>
              </TabList>
            </Tabs>
          </Box>

          <Box>
            {viewMode === "list" ? (
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>
                      <Checkbox
                        checked={
                          hasResults &&
                          selectedRows.length === currentUsers.length
                        }
                        indeterminate={
                          hasResults &&
                          selectedRows.length > 0 &&
                          selectedRows.length < currentUsers.length
                        }
                        onChange={handleSelectAllChange}
                        disabled={!hasResults}
                      />
                    </th>
                    <th style={{ width: "60px" }}></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th style={{ width: "60px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>
                        <Checkbox
                          checked={selectedRows.includes(user.id)}
                          onChange={() => handleRowCheckboxChange(user.id)}
                        />
                      </td>
                      <td>
                        {user.avatar ? (
                          <Avatar
                            src={user.avatar}
                            sx={{ width: 28, height: 28 }}
                          />
                        ) : (
                          <Avatar sx={{ width: 28, height: 28 }}>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                        )}
                      </td>
                      <td>
                        <Typography
                          sx={{
                            fontWeight: "300",
                            fontSize: "14px",
                            color: "var(--joy-palette-text-primary)",
                          }}
                        >
                          {user.name}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          sx={{
                            fontWeight: "400",
                            color: "var(--joy-palette-text-secondary)",
                            fontSize: "14px",
                          }}
                        >
                          {user.email}
                        </Typography>
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
                            <TrashIcon fontSize="20px" style={iconStyle} />
                            Delete
                          </Box>
                        </Popper>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                {currentUsers.map((user, index) => (
                  <Card
                    key={user.id}
                    sx={{
                      mb: 0,
                      p: "16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      {user.avatar ? (
                        <Avatar
                          src={user.avatar}
                          sx={{ width: 48, height: 48 }}
                        />
                      ) : (
                        <Avatar sx={{ width: 48, height: 48 }}>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                      )}
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor:
                            user.status === "active"
                              ? "#1A7D36"
                              : user.status === "inactive"
                              ? "#D3232F"
                              : "#FAE17D",
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          border: "2px solid white",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: "300",
                          fontSize: "14px",
                          color: "var(--joy-palette-text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        level="body-sm"
                        sx={{
                          color: "var(--joy-palette-text-secondary)",
                          fontWeight: "400",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
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
                        <TrashIcon fontSize="20px" style={iconStyle} />
                        Delete
                      </Box>
                    </Popper>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ flex: 0.7, mt: 2 }}>
          <Box
            sx={{
              mb: 3,
              borderBottom: "1px solid var(--joy-palette-divider)",
              pb: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: "300",
                mb: 1,
                fontSize: "14px",
                color: "var(--joy-palette-text-secondary)",
              }}
            >
              About
            </Typography>
            <Typography
              level="body-md"
              sx={{
                color: "var(--joy-palette-text-primary)",
                fontWeight: "300",
                fontSize: "14px",
              }}
            >
              {systemAdminRole.description}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontWeight: "300",
              mb: 1,
              fontSize: "14px",
              color: "var(--joy-palette-text-secondary)",
            }}
          >
            Permission
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {permissions.map((perm) => {
              const isExpanded = expandedPermissions.includes(perm.id);
              return (
                <Card
                  key={perm.id}
                  variant="outlined"
                  sx={{
                    p: "12px",
                    cursor: "pointer",
                    borderRadius: "8px",
                    bgcolor: "var(--joy-palette-background-mainBg)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => togglePermission(perm.id)}
                >
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "300",
                          fontSize: "14px",
                          color: "var(--joy-palette-text-primary)",
                        }}
                      >
                        {perm.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: "var(--joy-palette-text-secondary)",
                          fontWeight: "400",
                          fontSize: "12px",
                          mr: 1,
                        }}
                      >
                        {perm.access}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: "auto" }}>
                      {isExpanded ? (
                        <CaretUp size={16} weight="bold" />
                      ) : (
                        <CaretDown size={16} weight="bold" />
                      )}
                    </Box>
                  </Box>
                  {isExpanded && (
                    <Box
                      sx={{
                        borderTop: "1px solid var(--joy-palette-divider)",
                        pt: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "start",
                          gap: 1,
                        }}
                      >
                        <CheckCircle
                          size={20}
                          weight="bold"
                          color="#1A7D36"
                          style={{ minWidth: "20px" }}
                        />
                        <Typography
                          sx={{
                            color: "var(--joy-palette-text-secondary)",
                            fontWeight: "400",
                            fontSize: "12px",
                          }}
                        >
                          {perm.description}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Card>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        disabled={!hasResults}
      />
      <DeleteDeactivateUserModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        usersToDelete={usersToDelete}
      />
      <AddEditUser
        open={openAddUserModal}
        onClose={handleCloseAddUserModal}
        onSave={handleSaveUser}
      />
      <AddEditUser
        open={openEditModal}
        onClose={handleCloseEditModal}
        user={userToEdit}
        onSave={handleSaveUser}
      />
      <InviteUser
        open={openInviteUserModal}
        onClose={handleCloseInviteUserModal}
        userName={""}
        onConfirm={function (reason: string, customReason?: string): void {
          throw new Error("Function not implemented.");
        }}
      />
      <UserDetailsPopover
        open={Boolean(popoverAnchorEl)}
        onClose={handleClosePopover}
        anchorEl={popoverAnchorEl}
        user={selectedUser}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />
    </Box>
  );
};

export default SystemAdminSettings;
