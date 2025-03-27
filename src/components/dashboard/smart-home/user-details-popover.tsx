"use client";

import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { DotsThreeVertical as DotsIcon } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Password as Password } from "@phosphor-icons/react/dist/ssr/Password";
import { WarningCircle as WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import DeleteDeactivateUserModal from "../modals/DeleteDeactivateUserModal";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string | string[];
  customer: string;
  role: string;
  persona: string;
  status: string;
  initials?: string;
  avatar?: string;
  activity?: Array<{
    id: number;
    browserOs: string;
    locationTime: string;
  }>;
}

interface UserDetailsPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  user: User | null;
}

const UserDetailsPopover: React.FC<UserDetailsPopoverProps> = ({
  open,
  onClose,
  anchorEl,
  user,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);

  if (!open || !anchorEl || !user) return null;

  const emails = Array.isArray(user.email) ? user.email : [user.email];

  const confirmDelete = () => {
    setOpenDeleteModal(false);
  };

  const confirmDeactivate = () => {
    setOpenDeactivateModal(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    console.log(`Edit user ${user.id}`);
    handleMenuClose();
  };

  const handleDeactivate = () => {
    setOpenDeactivateModal(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
    handleMenuClose();
  };

  const handleResetPassword = () => {
    console.log(`Reset password for user ${user.id}`);
    handleMenuClose();
  };

  return (
    <Sheet
      sx={{
        position: "fixed",
        top: "20.3%",
        right: "1.5%",
        width: "400px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        zIndex: 1300,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            borderBottom: "1px solid #E5E7EB",
            paddingBottom: 2,
          }}
        >
          <Typography
            level="title-lg"
            sx={{ fontSize: "24px" }}
            fontWeight="600"
          >
            User Details
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="plain"
              size="sm"
              sx={{ color: "#636B74" }}
              onClick={onClose}
            >
              <XIcon fontSize="var(--Icon-fontSize)" />
            </Button>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            mb: 2,
            justifyContent: "space-between",
            width: "100%",
            borderBottom: "1px solid #E5E7EB",
            paddingBottom: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user.avatar ? (
              <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
            ) : user.initials ? (
              <Avatar sx={{ bgcolor: "#E0E7FF", color: "#4F46E5" }}>
                {user.initials}
              </Avatar>
            ) : (
              <Avatar />
            )}
            <Stack>
              <Typography
                level="body-lg"
                sx={{ fontSize: "18px" }}
                fontWeight="600"
              >
                {user.name}
              </Typography>
              <Typography
                level="body-sm"
                sx={{
                  color: user.status === "active" ? "#1A7D36" : "#D3232F",
                  bgcolor: user.status === "active" ? "#DCFCE7" : "#FEE2E2",
                  borderRadius: "10px",
                  px: 1,
                  display: "inline-block",
                  width: "fit-content",
                  fontSize: "12px",
                }}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Typography>
            </Stack>
          </Box>
          <Button
            variant="plain"
            size="sm"
            sx={{ color: "#636B74" }}
            onClick={handleMenuOpen}
          >
            <DotsIcon fontSize="var(--Icon-fontSize)" />
          </Button>
        </Stack>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          sx={{
            minWidth: "150px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            fontSize: "var(--joy-fontSize-sm)",
            zIndex: 1301,
          }}
        >
          <MenuItem onClick={handleEdit}>
            <PencilIcon
              fontSize="var(--Icon-fontSize)"
              style={{ marginRight: "8px" }}
            />
            Edit
          </MenuItem>
          <MenuItem
            onMouseDown={(event) => {
              event.preventDefault();
              handleDeactivate();
            }}
          >
            <ToggleLeft
              fontSize="var(--Icon-fontSize)"
              style={{ marginRight: "8px" }}
            />
            Deactivate
          </MenuItem>
          <MenuItem>
            <WarningCircle
              fontSize="var(--Icon-fontSize)"
              style={{ marginRight: "8px" }}
            />
            Suspend
          </MenuItem>
          <MenuItem
            onMouseDown={(event) => {
              event.preventDefault();
              handleResetPassword();
            }}
          >
            <Password
              fontSize="var(--Icon-fontSize)"
              style={{ marginRight: "8px" }}
            />
            Reset password
          </MenuItem>
          <MenuItem
            onMouseDown={(event) => {
              event.preventDefault();
              handleDelete();
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

        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "#636B74", width: "100px" }}
            >
              Name
            </Typography>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "var(--joy-palette-text-primary)" }}
            >
              {user.name}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "#636B74", width: "100px" }}
            >
              Email
            </Typography>
            <Stack spacing={0}>
              {emails.map((email, index) => (
                <Typography
                  key={index}
                  level="body-sm"
                  fontWeight="300"
                  sx={{ color: "var(--joy-palette-text-primary)" }}
                >
                  {email}
                </Typography>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "#636B74", width: "100px" }}
            >
              Customer
            </Typography>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "var(--joy-palette-text-primary)" }}
            >
              {user.customer}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "#636B74", width: "100px" }}
            >
              Role
            </Typography>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "var(--joy-palette-text-primary)" }}
            >
              {user.role}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ borderBottom: "1px solid #E5E7EB", paddingBottom: 2 }}
          >
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "#636B74", width: "100px" }}
            >
              Persona
            </Typography>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "var(--joy-palette-text-primary)" }}
            >
              {user.persona}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ borderBottom: "1px solid #E5E7EB", paddingBottom: 2 }}
          >
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "#6B7280", width: "100px" }}
            >
              Billing
            </Typography>
            <Stack spacing={0.5}>
              <Typography
                sx={{
                  borderRadius: "20px",
                  borderColor: "#E5E7EB",
                  color: "#4F46E5",
                  bgcolor: "#E0E7FF",
                  px: 1,
                  display: "inline-block",
                  width: "fit-content",
                  fontSize: "12px",
                  "&:hover": { bgcolor: "#C7D2FE" },
                }}
              >
                Enterprise
              </Typography>
              <Typography level="body-sm">
                <a
                  href="#"
                  style={{ color: "#4F46E5", textDecoration: "none" }}
                >
                  Covered by MarketSphere
                </a>
              </Typography>
              <Typography level="body-sm" sx={{ color: "#111827" }}>
                2,000 users
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Typography
              level="body-sm"
              fontWeight="300"
              sx={{ color: "#6B7280", width: "100px" }}
            >
              Activity
            </Typography>
            <Stack spacing={1}>
              {user.activity && user.activity.length > 0 ? (
                user.activity.map((act) => (
                  <Stack key={act.id} spacing={0}>
                    <Typography
                      level="body-sm"
                      fontWeight="300"
                      sx={{ color: "#111827" }}
                    >
                      {act.browserOs}
                    </Typography>
                    <Typography
                      level="body-sm"
                      fontWeight="300"
                      sx={{ color: "#111827" }}
                    >
                      {act.locationTime}
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Typography
                  level="body-sm"
                  fontWeight="300"
                  sx={{ color: "#111827" }}
                >
                  No activity data available
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <DeleteDeactivateUserModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <DeleteDeactivateUserModal
        open={openDeactivateModal}
        onClose={() => setOpenDeactivateModal(false)}
        onConfirm={confirmDeactivate}
        isDeactivate={true}
      />
    </Sheet>
  );
};

export default UserDetailsPopover;
