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
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Funnel as FunnelIcon } from "@phosphor-icons/react/dist/ssr/Funnel";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { DotsThreeVertical as DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { Copy as CopyIcon } from "@phosphor-icons/react/dist/ssr/Copy";
import { X as X } from "@phosphor-icons/react/dist/ssr/X";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft";
import { config } from "@/config";
import DeleteDeactivateUserModal from "@/components/dashboard/modals/DeleteDeactivateUserModal";
import UserDetailsPopover from '@/components/dashboard/smart-home/user-details-popover';

const metadata = {
  title: `User Management | Dashboard | ${config.site.name}`,
} satisfies Metadata;

interface User {
  id: number;
  name: string;
  email: string;
  customer: string;
  role: string;
  persona: string;
  status: string;
  initials?: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Jacob Jones",
    email: "trungkienspktnd@gmail.com",
    customer: "StockHive",
    role: "Customer admin",
    persona: "Education",
    status: "suspended",
  },
  {
    id: 2,
    name: "Albert Flores",
    email: "nvt.isst.nute@gmail.com",
    customer: "TradeNest",
    role: "User",
    persona: "Titles",
    status: "active",
  },
  {
    id: 3,
    name: "Devon Lane",
    email: "binhan628@gmail.com",
    customer: "TradeNest",
    role: "Customer admin",
    persona: "Experience",
    status: "active",
  },
  {
    id: 4,
    name: "Floyd Miles",
    email: "danghoang87hl@gmail.com",
    customer: "TradeNest",
    role: "Customer admin",
    persona: "Responsibilities",
    status: "active",
  },
  {
    id: 5,
    name: "Eleanor Pena",
    email: "binhan628@gmail.com",
    customer: "MarketSphere",
    role: "Customer admin",
    persona: "Customer admin",
    status: "active",
    initials: "JG",
  },
  {
    id: 6,
    name: "Courtney Henry",
    email: "tranthuy.nute@gmail.com",
    customer: "InvestHorizon",
    role: "User",
    persona: "User",
    status: "inactive",
  },
  {
    id: 7,
    name: "Annette Black",
    email: "tranthuy.nute@gmail.com",
    customer: "InvestHorizon",
    role: "User",
    persona: "Education",
    status: "active",
  },
  {
    id: 8,
    name: "Brooklyn Simmons",
    email: "ckctm12@gmail.com",
    customer: "EquityVault",
    role: "User",
    persona: "Education",
    status: "active",
  },
  {
    id: 9,
    name: "Kristin Watson",
    email: "vuhaithuongnute@gmail.com",
    customer: "StockAnchor",
    role: "User",
    persona: "Education",
    status: "active",
  },
  {
    id: 10,
    name: "Theresa Webb",
    email: "nvt.isst.nute@gmail.com",
    customer: "EquityVault",
    role: "User",
    persona: "Experience",
    status: "active",
  },
  {
    id: 11,
    name: "Jane Cooper",
    email: "tranthuy.nute@gmail.com",
    customer: "BullBear Hub",
    role: "User",
    persona: "Experience",
    status: "inactive",
  },
  {
    id: 12,
    name: "Arlene McCoy",
    email: "manhhackt08@gmail.com",
    customer: "BullBear Hub",
    role: "User",
    persona: "Titles",
    status: "inactive",
    initials: "JG",
  },
  {
    id: 13,
    name: "Jerome Bell",
    email: "vuhaithuongnute@gmail.com",
    customer: "StockAnchor",
    role: "User",
    persona: "Titles",
    status: "inactive",
  },
  {
    id: 14,
    name: "Marvin McKinney",
    email: "binhan628@gmail.com",
    customer: "StockAnchor",
    role: "User",
    persona: "Education",
    status: "inactive",
    initials: "JG",
  },
];

export default function Page(): React.JSX.Element {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = React.useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = React.useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = React.useState<number | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = React.useState(false);
  const [rowsToDelete, setRowsToDelete] = React.useState<number[]>([]);
  const [isDeactivating, setIsDeactivating] = React.useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<null | HTMLElement>(null); // For popover
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null); // For selected user

  React.useEffect(() => {
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

  const handleDeleteRow = React.useCallback((userId: number) => {
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
    setSelectedRows([]);
    setRowsToDelete([]);
    setOpenDeleteModal(false);
  };

  const confirmDeactivate = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        rowsToDelete.includes(user.id) ? { ...user, status: "inactive" } : user
      )
    );
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

  const handleOpenDetail = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setPopoverAnchorEl(event.currentTarget); // Use the triggering element
    }
    handleMenuClose();
  };

  const handleClosePopover = () => {
    setSelectedUser(null);
    setPopoverAnchorEl(null);
  };

  const handleEdit = (userId: number) => {
    console.log(`Edit user ${userId}`);
    handleMenuClose();
  };

  const usersToDelete = rowsToDelete
    .map((userId) => {
      const user = users.find((u) => u.id === userId);
      return user ? user.name : undefined;
    })
    .filter((name): name is string => name !== undefined);

  return (
    <Box sx={{ p: "var(--Content-padding)" }}>
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
            <Button
              variant="outlined"
              startDecorator={<FunnelIcon fontSize="var(--Icon-fontSize)" />}
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
            <Button
              variant="solid"
              startDecorator={<PlusIcon fontSize="var(--Icon-fontSize)" />}
              sx={{
                borderRadius: "20px",
                bgcolor: "#4F46E5",
                color: "#FFFFFF",
                padding: "8px 16px",
                "&:hover": {
                  bgcolor: "#4338CA",
                },
              }}
            >
              Add user
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ overflowX: "auto" }}>
          <Table
            aria-label="user management table"
            sx={{
              minWidth: 800,
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              "& thead th": {
                backgroundColor: "var(--joy-palette-background-mainBg)",
                alignItems: "center",
                verticalAlign: "middle",
              },
              "& th, & td": {
                padding: "10px",
                alignItems: "center",
                verticalAlign: "middle",
              },
              "& tbody tr:hover": {
                backgroundColor: "var(--joy-palette-background-mainBg)",
                cursor: "pointer",
              },
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "5%" }}>
                  <Checkbox
                    checked={selectedRows.length === users.length}
                    onChange={handleSelectAllChange}
                    sx={{ alignSelf: "center" }}
                  />
                </th>
                <th style={{ width: "20%" }}>User name</th>
                <th style={{ width: "25%" }}>Email</th>
                <th style={{ width: "20%" }}>Customer</th>
                <th style={{ width: "15%" }}>Role</th>
                <th style={{ width: "15%" }}>Persona</th>
                <th style={{ width: "5%" }}></th>
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
                      onChange={() => handleRowCheckboxChange(user.id)}
                      sx={{ alignSelf: "center" }}
                    />
                  </td>
                  <td>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      {user.initials ? (
                        <Avatar sx={{ bgcolor: "#E0E7FF", color: "#4F46E5" }}>
                          {user.initials}
                        </Avatar>
                      ) : (
                        <Avatar />
                      )}
                      <Typography>{user.name}</Typography>
                      <Tooltip
                        title={user.status}
                        placement="top"
                        sx={{ background: "#DAD8FD", color: "#3D37DD" }}
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
                            height: "10px",
                            display: "inline-block",
                          }}
                        />
                      </Tooltip>
                    </Stack>
                  </td>
                  <td>
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      {user.email}
                      {hoveredRow === index && (
                        <IconButton
                          size="sm"
                          onClick={() => handleCopyEmail(user.email)}
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
                      )}
                      {copiedEmail === user.email && (
                        <Box
                          sx={{
                            position: "fixed",
                            bottom: "20px",
                            right: "50%",
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
                  <td>{user.customer}</td>
                  <td>{user.role}</td>
                  <td>{user.persona}</td>
                  <td>
                    <IconButton
                      size="sm"
                      onClick={(event) => {
                        handleMenuOpen(event, index);
                      }}
                    >
                      <DotsThreeVertical fontSize="var(--Icon-fontSize)" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={menuRowIndex === index && Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      sx={{
                        minWidth: "150px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        fontSize: "var(--joy-fontSize-sm)",
                      }}
                    >
                      <MenuItem 
  onMouseDown={(event) => {
    event.preventDefault();
    handleOpenDetail(event, user.id); // Pass the event
  }}
>
  <EyeIcon fontSize="var(--Icon-fontSize)" style={{ marginRight: "8px" }} />
  Open detail
</MenuItem>
                      <MenuItem onClick={() => handleEdit(user.id)}>
                        <PencilIcon
                          fontSize="var(--Icon-fontSize)"
                          style={{ marginRight: "8px" }}
                        />
                        Edit
                      </MenuItem>
                      <MenuItem
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleDeactivate(user.id);
                          handleMenuClose();
                        }}
                      >
                        <ToggleLeft
                          fontSize="var(--Icon-fontSize)"
                          style={{ marginRight: "8px" }}
                        />
                        Deactivate
                      </MenuItem>
                      <MenuItem
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleDeleteRow(user.id);
                          handleMenuClose();
                        }}
                        sx={{ color: "#EF4444" }}
                      >
                        <TrashIcon
                          fontSize="var(--Icon-fontSize)"
                          style={{ marginRight: "8px" }}
                        />
                        Delete
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
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
    </Box>
  );
}