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
import { Funnel as FunnelIcon } from "@phosphor-icons/react/dist/ssr/Funnel";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { DotsThreeVertical as DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { Copy as CopyIcon } from "@phosphor-icons/react/dist/ssr/Copy";
import { X as X } from "@phosphor-icons/react/dist/ssr/X";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { Password as Password } from "@phosphor-icons/react/dist/ssr/Password";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft";
import { config } from "@/config";
import DeleteDeactivateUserModal from "@/components/dashboard/modals/DeleteDeactivateUserModal";
import UserDetailsPopover from "@/components/dashboard/smart-home/user-details-popover";
import { useState, useCallback, useEffect } from "react";
import AddEditUser from "@/components/dashboard/modals/AddEditUser";
import Pagination from "@/components/dashboard/layout/pagination";
import ResetPasswordUser from "@/components/dashboard/modals/ResetPasswordUserModal";
import UserManagementFilter from "@/components/dashboard/smart-home/user-management-filter";
import { Popper } from "@mui/base/Popper";
import { ArrowsDownUp as SortIcon } from "@phosphor-icons/react/dist/ssr/ArrowsDownUp";
import SearchInput from "@/components/dashboard/layout/search-input";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";

const metadata = {
  title: `User Management | Dashboard | ${config.site.name}`,
} satisfies Metadata;

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

const initialUsers: User[] = [
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

export default function Page(): React.JSX.Element {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(
    null
  );
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 11;
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const hasResults = filteredUsers.length > 0;

  useEffect(() => {
    if (!filtersApplied) {
      setFilteredUsers(users);
    }
  }, [users, filtersApplied]);

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

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setRowsToDelete(selectedRows);
      setOpenDeleteModal(true);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    if (filtersApplied) {
      setFilteredUsers((prevFiltered) =>
        prevFiltered.filter((user) => user.id !== userId)
      );
    }
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
    setPopoverAnchorEl(null);
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
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !rowsToDelete.includes(user.id))
    );
    if (filtersApplied) {
      setFilteredUsers((prevFiltered) =>
        prevFiltered.filter((user) => !rowsToDelete.includes(user.id))
      );
    }
    setSelectedRows([]);
    setRowsToDelete([]);
    setOpenDeleteModal(false);
    if (filtersApplied) {
      const newTotalPages = Math.ceil(
        (filteredUsers.length - rowsToDelete.length) / rowsPerPage
      );
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
    }
  };

  const confirmDeactivate = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        rowsToDelete.includes(user.id) ? { ...user, status: "inactive" } : user
      )
    );
    if (filtersApplied) {
      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((user) =>
          rowsToDelete.includes(user.id)
            ? { ...user, status: "inactive" }
            : user
        )
      );
    }
    setSelectedRows([]);
    setRowsToDelete([]);
    setOpenDeactivateModal(false);
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

  const handleOpenDetail = (
    event: React.MouseEvent<HTMLElement>,
    userId: number
  ) => {
    event.preventDefault();
    const user = filteredUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setPopoverAnchorEl(event.currentTarget);
    }
    handleMenuClose();
  };

  const handleClosePopover = () => {
    setSelectedUser(null);
    setPopoverAnchorEl(null);
  };

  const handleEdit = (userId: number) => {
    const user = filteredUsers.find((u) => u.id === userId);
    if (user) {
      setUserToEdit(user);
      setOpenEditModal(true);
    }
    handleMenuClose();
  };

  const handleAddUser = () => {
    setOpenAddUserModal(true);
    handleMenuClose();
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
    if (filtersApplied) {
      setFilteredUsers((prevFiltered) => {
        const userExists = prevFiltered.some(
          (user) => user.id === updatedUser.id
        );
        if (userExists) {
          return prevFiltered.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          );
        } else {
          return prevFiltered;
        }
      });
    }
    if (selectedUser && selectedUser.id === updatedUser.id) {
      setSelectedUser(updatedUser);
    }
  };

  const handleResetPassword = (userId: number) => {
    const user = filteredUsers.find((u) => u.id === userId);
    if (user) {
      setUserToResetPassword(user);
      setOpenResetPasswordModal(true);
    }
    handleMenuClose();
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setUserToEdit(undefined);
  };

  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
    setUserToEdit(undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]);
  };

  const handleFilter = (filtered: User[], filtersApplied: boolean) => {
    setFiltersApplied(filtersApplied);
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleSort = (column: keyof User) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return newDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  const handleSearch = (searchTerm: string) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();

    if (!trimmedSearch) {
      setFilteredUsers(users);
      setFiltersApplied(false);
      return;
    }

    const searchedUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(trimmedSearch) ||
        (typeof user.email === "string" &&
          user.email.toLowerCase().includes(trimmedSearch)) ||
        user.customer.toLowerCase().includes(trimmedSearch) ||
        user.role.toLowerCase().includes(trimmedSearch) ||
        user.persona.toLowerCase().includes(trimmedSearch)
    );

    setFilteredUsers(searchedUsers);
    setFiltersApplied(true);
    setCurrentPage(1);
  };

  const usersToDelete = rowsToDelete
    .map((userId) => {
      const user = filteredUsers.find((u) => u.id === userId);
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

        <Box sx={{ overflowX: "auto" }}>
          <Table aria-label="user management table">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>
                <Checkbox
                  checked={hasResults && selectedRows.length === currentUsers.length}
                  indeterminate={
                    hasResults && 
                    selectedRows.length > 0 && 
                    selectedRows.length < currentUsers.length
                  }
                  onChange={handleSelectAllChange}
                  disabled={!hasResults}
                />
                </th>
                <th style={{ width: "20%" }} onClick={() => handleSort("name")}>
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
                <th style={{ width: "15%" }} onClick={() => handleSort("role")}>
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
                <th
                  style={{ width: "15%" }}
                  onClick={() => handleSort("persona")}
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
                    Persona
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
              {filteredUsers.length === 0 ? (
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
              ) : currentUsers.length === 0 ? (
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
                currentUsers.map((user, index) => (
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
                        <Typography>{user.name}</Typography>
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
                        }}
                      >
                        {user.email}
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
                      {user.customer}
                    </td>
                    <td style={{ color: "var(--joy-palette-text-secondary)" }}>
                      {user.role}
                    </td>
                    <td style={{ color: "var(--joy-palette-text-secondary)" }}>
                      {user.persona}
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
                        <Box sx={menuItemStyle}>
                          <ArrowRightIcon fontSize="20px" style={iconStyle} />
                          Impersonate user
                        </Box>
                        <Box
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleDeactivate(user.id);
                            handleMenuClose();
                          }}
                          sx={menuItemStyle}
                        >
                          <ToggleLeft fontSize="20px" style={iconStyle} />
                          Deactivate
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
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />

      <AddEditUser
        open={openEditModal}
        onClose={handleCloseEditModal}
        user={userToEdit}
        onSave={handleSaveUser}
      />

      <AddEditUser
        open={openAddUserModal}
        onClose={handleCloseAddUserModal}
        onSave={handleSaveUser}
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
    </Box>
  );
}
