"use client";

import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { DotsThreeVertical as DotsIcon } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Password as Password } from "@phosphor-icons/react/dist/ssr/Password";
import { Warning as Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import DeleteDeactivateUserModal from "../modals/DeleteDeactivateUserModal";
import ResetPasswordUserModal from "../modals/ResetPasswordUserModal";
import SuspendUserModal from "../modals/SuspendUserModal";
import { useState, useEffect, useRef } from "react";
import AddEditUser from "../modals/AddEditUser";
import { Popper } from "@mui/base/Popper";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { useColorScheme } from "@mui/joy/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../../lib/api/users";
import { ApiUser } from "@/contexts/auth/types";


interface UserDetailsPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  user: ApiUser | null;
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
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [openSuspendModal, setOpenSuspendModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const popperRef = useRef<HTMLDivElement>(null);
  const { colorScheme } = useColorScheme();
  const isLightTheme = colorScheme === "light";
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popperRef.current &&
        !popperRef.current.contains(event.target as Node) &&
        menuAnchorEl &&
        !menuAnchorEl.contains(event.target as Node)
      ) {
        handleMenuClose();
      }
    };

    if (menuAnchorEl) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (menuAnchorEl) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [menuAnchorEl]);

  if (!open || !anchorEl || !user) {
    return null;
  }

  const emails = Array.isArray(user.email) ? user.email : [user.email];

  const confirmDelete = () => {
    setOpenDeleteModal(false);
    // TODO: Implement delete API call
    onClose();
  };

  const confirmDeactivate = () => {
    setOpenDeactivateModal(false);
    if (user) {
      updateUserMutation.mutate({ id: user.id, status: "inactive" });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
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
    setOpenResetPasswordModal(true);
    handleMenuClose();
  };

  const handleConfirmSuspend = () => {
    if (user) {
      updateUserMutation.mutate({ id: user.id, status: "inactive" });
      setOpenSuspendModal(false);
    }
  };

  const handleSuspend = () => {
    setOpenSuspendModal(true);
    handleMenuClose();
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
    color: "var(--joy-palette-text-primary)",
  };

  return (
    <>
      <Sheet
        sx={{
          position: "absolute",
          top: "20.3%",
          right: "1.5%",
          width: "500px",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          zIndex: 1300,
          border: "1px solid var(--joy-palette-divider)",
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
              borderBottom: "1px solid var(--joy-palette-divider)",
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
              <Button variant="plain" size="sm" onClick={onClose}>
                <XIcon fontSize="20px" weight="bold" />
              </Button>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              width: "100%",
              borderBottom: "1px solid var(--joy-palette-divider)",
              paddingBottom: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {user.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 64, height: 64 }} />
                ) : (
                  <Avatar sx={{ width: 64, height: 64 }} />
                )}
                <Stack>
                  <Typography
                    level="body-lg"
                    sx={{
                      fontSize: "18px",
                      color: "var(--joy-palette-text-primary)",
                    }}
                    fontWeight="600"
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{
                      color:
                        user.status === "active"
                          ? "#1A7D36"
                          : user.status === "suspended"
                          ? "#4D2D00"
                          : "#D3232F",
                      bgcolor:
                        user.status === "active"
                          ? "#DCFCE7"
                          : user.status === "suspended"
                          ? "#FFF8C5"
                          : "#FEE2E2",
                      borderRadius: "10px",
                      px: 1,
                      display: "inline-block",
                      width: "fit-content",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Typography>
                </Stack>
              </Box>

              <Button
                variant="plain"
                size="sm"
                sx={{
                  color: "#636B74",
                  background: "transparent",
                  p: 0,
                  "&:hover": {
                    background: "transparent",
                    opacity: "0.8",
                  },
                }}
                onClick={handleMenuOpen}
              >
                <DotsIcon
                  weight="bold"
                  size={22}
                  color="var(--joy-palette-text-secondary)"
                />
              </Button>
            </Box>

            {user.status === "suspended" && (
              <Box
                sx={{
                  bgcolor: isLightTheme ? "#FFF8C5" : "transparent",
                  border: isLightTheme ? "transparent" : "1px solid #4D2D00",
                  borderRadius: "8px",
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <Warning size={20} color={isLightTheme ? "#4D2D00" : "rgb(198, 143, 66)"} />
                <Typography
                  level="body-sm"
                  sx={{
                    fontSize: "14px",
                    color: isLightTheme ? "#4D2D00" : "rgb(198, 143, 66)",
                    fontWeight: 300,
                  }}
                >
                  Account suspended by suspicious activity
                </Typography>
              </Box>
            )}
          </Stack>
          <Popper
            ref={popperRef}
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            placement="bottom-start"
            style={{
              minWidth: "150px",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "var(--joy-palette-background-surface)",
              zIndex: 1301,
              border: "1px solid var(--joy-palette-divider)",
            }}
          >
            <Box
              onMouseDown={(event) => {
                event.preventDefault();
                handleEdit();
              }}
              sx={menuItemStyle}
            >
              <PencilIcon fontSize="20px" style={iconStyle} />
              Edit
            </Box>
            {/* <Box sx={menuItemStyle}>
              <ArrowRightIcon fontSize="20px" style={iconStyle} />
              Impersonate user
            </Box>
            <Box
              onMouseDown={(event) => {
                event.preventDefault();
                handleDeactivate();
              }}
              sx={menuItemStyle}
            >
              <ToggleLeft fontSize="20px" style={iconStyle} />
              Deactivate
            </Box>
            <Box
              onMouseDown={(event) => {
                event.preventDefault();
                handleSuspend();
              }}
              sx={menuItemStyle}
            >
              <Warning fontSize="20px" style={{ marginRight: "14px" }} />
              Suspend
            </Box>
            <Box
              onMouseDown={(event) => {
                event.preventDefault();
                handleResetPassword();
              }}
              sx={menuItemStyle}
            >
              <Password fontSize="20px" style={iconStyle} />
              Reset password
            </Box>
            <Box
              onMouseDown={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              sx={{ ...menuItemStyle, color: "#EF4444" }}
            >
              <TrashIcon fontSize="20px" style={{ marginRight: "14px" }} />
              Delete
            </Box> */}
          </Popper>
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
                {user.customer?.name}
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
                {user.role?.name}
              </Typography>
            </Stack>

            {/* <Stack
              direction="row"
              spacing={2}
              sx={{
                borderBottom: "1px solid var(--joy-palette-divider)",
                paddingBottom: 2,
              }}
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
            </Stack> */}

            <Stack
              direction="row"
              spacing={2}
              sx={{
                borderBottom: "1px solid var(--joy-palette-divider)",
                paddingBottom: 2,
              }}
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
                <Typography
                  level="body-sm"
                  sx={{ color: "var(--joy-palette-text-primary)" }}
                >
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
                        sx={{
                          color: "var(--joy-palette-text-primary)",
                          fontSize: "14px",
                        }}
                      >
                        {act.browserOs}
                      </Typography>
                      <Typography
                        level="body-sm"
                        fontWeight="300"
                        sx={{
                          color: "var(--joy-palette-text-secondary)",
                          fontSize: "12px",
                        }}
                      >
                        {act.locationTime}
                      </Typography>
                    </Stack>
                  ))
                ) : (
                  <Typography
                    level="body-sm"
                    fontWeight="300"
                    sx={{ color: "var(--joy-palette-text-primary)" }}
                  >
                    No activity data available
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Sheet>

      <DeleteDeactivateUserModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        usersToDelete={[user.name]}
      />

      <DeleteDeactivateUserModal
        open={openDeactivateModal}
        onClose={() => setOpenDeactivateModal(false)}
        onConfirm={confirmDeactivate}
        isDeactivate={true}
        usersToDelete={[user.name]}
      />

      <ResetPasswordUserModal
        open={openResetPasswordModal}
        onClose={() => setOpenResetPasswordModal(false)}
        userName={user.name}
        userEmail={user.email}
        onConfirm={(selectedEmail) => {
          console.log(`Resetting password for ${selectedEmail}`);
        }}
      />

      <SuspendUserModal
        open={openSuspendModal}
        onClose={() => setOpenSuspendModal(false)}
        userName={user.name}
        onConfirm={handleConfirmSuspend}
      />

      <AddEditUser
        open={openEditModal}
        onClose={handleCloseEditModal}
        userId={user.id}
      />
    </>
  );
};

export default UserDetailsPopover;