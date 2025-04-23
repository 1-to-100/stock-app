"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { IconButton } from "@mui/joy";
import { useRouter } from "next/navigation";
import { paths } from "@/paths";
import { PencilSimple as PencilIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { useState } from "react";
import { Popper } from "@mui/base/Popper";
import AddRoleModal from "../modals/AddRoleModal";

export interface Role {
  id: string;
  abbreviation: string;
  name: string;
  description: string;
  _count: {
    users: number;
  };
}

interface RoleSettingsProps {
  roles: Role[];
  fetchRoles: () => void;
}

const RoleSettings: React.FC<RoleSettingsProps> = ({ roles, fetchRoles }) => {
  const router = useRouter();
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEditRoleModal, setOpenEditRoleModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const handleCardClick = async (roleId: string) => {
    try {
      router.push(
        `${paths.dashboard.roleSettings.systemAdmin}?roleId=${roleId}`
      );
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    roleId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveRoleId(roleId);
  };

  const handleEditRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setOpenEditRoleModal(true);
    handleMenuClose();
  };

  const handleCloseEditRoleModal = () => {
    setOpenEditRoleModal(false);
    setSelectedRoleId(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRoleId(null);
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        p: 0,
        gap: 2,
        mt: 2,
        maxWidth: "1050px",
      }}
    >
      {roles.map((role: Role) => (
        <Card
          key={role.id}
          variant="outlined"
          onClick={() => handleCardClick(role.id)}
          sx={{
            p: "16px",
            borderRadius: "8px",
            border: "1px solid var(--joy-palette-divider)",
            boxShadow: "none",
            backgroundColor: "var(--joy-palette-background-body)",
            display: "flex",
            flexDirection: "column",
            minHeight: "210px",
            cursor: "pointer",
            "&:hover": {
              borderColor: "var(--joy-palette-text-secondary)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor:
                  role.abbreviation === "SA"
                    ? "#DAD8FD"
                    : role.abbreviation === "CS"
                    ? "#DDE7EE"
                    : role.abbreviation === "CA"
                    ? "#FFE9E8"
                    : role.abbreviation === "MA"
                    ? "#FFF8C5"
                    : "#FFE9E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "16px",
                color:
                  role.abbreviation === "SA"
                    ? "#443DF6"
                    : role.abbreviation === "CS"
                    ? "#555E68"
                    : role.abbreviation === "CA"
                    ? "#9C1818"
                    : role.abbreviation === "MA"
                    ? "#7D4E00"
                    : "#D3232F",
              }}
            >
              {role.abbreviation}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                level="title-md"
                sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                }}
              >
                {role.name.slice(0, 59)}
              </Typography>
              <Typography
                level="body-xs"
                sx={{
                  mt: 0.5,
                  color: "var(--joy-palette-text-secondary)",
                  fontWeight: "400",
                  fontSize: "12px",
                }}
              >
                Default role
              </Typography>
            </Box>
            <IconButton
              size="sm"
              onClick={(event) => handleMenuOpen(event, role.id)}
            >
              <DotsThree
                weight="bold"
                size={22}
                color="var(--joy-palette-text-secondary)"
              />
            </IconButton>
            <Popper
              open={activeRoleId === role.id && Boolean(anchorEl)}
              anchorEl={anchorEl}
              placement="bottom-start"
              style={{
                minWidth: "150px",
                borderRadius: "8px",
                backgroundColor: "var(--joy-palette-background-surface)",
                zIndex: 1300,
                border: "1px solid var(--joy-palette-divider)",
              }}
            >
              <Box
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleEditRole(role.id);
                }}
                sx={menuItemStyle}
              >
                <PencilIcon fontSize="20px" style={iconStyle} />
                Edit
              </Box>
              <Box
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleMenuClose();
                }}
                sx={{ ...menuItemStyle, color: "#EF4444" }}
              >
                <TrashIcon fontSize="20px" style={iconStyle} />
                Delete
              </Box>
            </Popper>
          </Box>
          <Box
            sx={{
              mt: 1.5,
              flexGrow: 1,
            }}
          >
            <Typography
              level="body-sm"
              sx={{
                color: "var(--joy-palette-text-secondary)",
                fontWeight: "300",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {role.description.slice(0, 89)}
            </Typography>
          </Box>
          <Typography
            level="body-md"
            sx={{
              fontWeight: "400",
              fontSize: "12px",
              color: "var(--joy-palette-text-secondary)",
              pt: 1.5,
              borderTop: "1px solid var(--joy-palette-divider)",
              mt: "auto",
            }}
          >
            {role._count.users} people
          </Typography>
        </Card>
      ))}
      <AddRoleModal
        open={openEditRoleModal}
        onClose={handleCloseEditRoleModal}
        roleId={selectedRoleId ? Number(selectedRoleId) : undefined}
        onRoleCreated={fetchRoles}
      />
    </Box>
  );
};

export default RoleSettings;