"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import RoleSettings from "@/components/dashboard/role-settings/role-settings";
import UserPersonas from "@/components/dashboard/role-settings/user-personas";
import SearchInput from "@/components/dashboard/layout/search-input";
import { getRoles } from "../../../lib/api/roles";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import Button from "@mui/joy/Button";
import AddRoleModal from "../../../components/dashboard/modals/AddRoleModal";
import CircularProgress from "@mui/joy/CircularProgress";

interface HttpError extends Error {
  response?: {
    status: number;
  };
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  _count: {
    users: number;
  };
}

export interface RoleSettingsRole {
  id: string;
  abbreviation: string;
  name: string;
  description: string;
  _count: {
    users: number;
  };
}

export default function Page(): React.JSX.Element {
  const [roles, setRoles] = useState<RoleSettingsRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<HttpError | null>(null);
  const [openAddRoleModal, setOpenAddRoleModal] = useState(false);

  const fetchRoles = async () => {
    try {
      const fetchedRoles: Role[] = await getRoles();
      const transformedRoles: RoleSettingsRole[] = fetchedRoles.map((role) => ({
        id: role.id.toString(),
        abbreviation: role.name.slice(0, 2).toUpperCase(),
        name: role.name,
        description: role.description || "No description provided",
        _count: {
          users: role._count.users,
        },
      }));
      setRoles(transformedRoles);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRoles([]);
      setError(error as HttpError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRoleModal = () => {
    setOpenAddRoleModal(true);
  };

  const handleCloseAddRoleModal = () => {
    setOpenAddRoleModal(false);
  };

  const handleSearch = (searchTerm: string) => {};

  if (error && error.response?.status === 403) {
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

  if (error) {
    return <Typography>Error loading roles: {error.message}</Typography>;
  }

  return (
    <Box sx={{ p: "var(--Content-padding)" }}>
      <SearchInput
        onSearch={handleSearch}
        style={{ position: "fixed", top: "4%", zIndex: "1000" }}
      />
      <Stack spacing={3}>
        <Stack
          display={"flex"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography fontSize={{ xs: "xl3", lg: "xl4" }} level="h1">
            Role Settings
          </Typography>
          <Stack>
            <Button
              variant="solid"
              color="primary"
              onClick={handleAddRoleModal}
              startDecorator={<PlusIcon fontSize="var(--Icon-fontSize)" />}
            >
              Add role
            </Button>
          </Stack>
        </Stack>

        {loading ? (
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
        ) : roles.length > 0 ? (
          <RoleSettings roles={roles} fetchRoles={fetchRoles} />
        ) : (
          <UserPersonas />
        )}
      </Stack>
      <AddRoleModal
        open={openAddRoleModal}
        onClose={handleCloseAddRoleModal}
        onRoleCreated={fetchRoles}
      />
    </Box>
  );
}
