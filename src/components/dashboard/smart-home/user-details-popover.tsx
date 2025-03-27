"use client";

import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { DotsThreeVertical as DotsIcon } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";

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
  if (!user || !anchorEl) return null;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        "& .MuiPopover-paper": {
          width: "400px",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
        >
          <Typography level="title-sm">User Details</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="plain"
              size="sm"
              sx={{ color: "#636B74" }}
              onClick={onClose}
            >
              <XIcon fontSize="var(--Icon-fontSize)" />
            </Button>
            <Button variant="plain" size="sm" sx={{ color: "#636B74" }}>
              <DotsIcon fontSize="var(--Icon-fontSize)" />
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: "#E0E7FF", color: "#4F46E5" }}>
            {user.initials || user.name.charAt(0)}
          </Avatar>
          <Stack>
            <Typography level="body-lg" fontWeight="bold">
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
              }}
            >
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Stack>
            <Typography level="body-sm" fontWeight="bold">
              Name
            </Typography>
            <Typography level="body-sm">{user.name}</Typography>
          </Stack>
          <Stack>
            <Typography level="body-sm" fontWeight="bold">
              Email
            </Typography>
            <Typography level="body-sm">{user.email}</Typography>
          </Stack>
          <Stack>
            <Typography level="body-sm" fontWeight="bold">
              Customer
            </Typography>
            <Typography level="body-sm">{user.customer}</Typography>
          </Stack>
          <Stack>
            <Typography level="body-sm" fontWeight="bold">
              Role
            </Typography>
            <Typography level="body-sm">{user.role}</Typography>
          </Stack>
          <Stack>
            <Typography level="body-sm" fontWeight="bold">
              Persona
            </Typography>
            <Typography level="body-sm">{user.persona}</Typography>
          </Stack>
          <Stack>
            <Typography level="body-sm" fontWeight="bold">
              Billing
            </Typography>
            <Button
              variant="outlined"
              size="sm"
              sx={{
                borderRadius: "20px",
                borderColor: "#E5E7EB",
                color: "#4F46E5",
                bgcolor: "#E0E7FF",
                "&:hover": { bgcolor: "#C7D2FE" },
              }}
            >
              Enterprise
            </Button>
            <Typography level="body-sm" sx={{ mt: 1 }}>
              <a href="#" style={{ color: "#4F46E5", textDecoration: "none" }}>
                Covered by MarketSphere
              </a>
            </Typography>
            <Typography level="body-sm">2,000 users</Typography>
          </Stack>
          <Stack>
            <Typography level="body-sm" fontWeight="bold">
              Activity
            </Typography>
            <Typography level="body-sm">Chrome, Mac OS 10.15.7</Typography>
            <Typography level="body-sm">
              California, USA • May 08 10:40AM
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Popover>
  );
};

export default UserDetailsPopover;