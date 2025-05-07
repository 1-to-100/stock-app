"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import RoleSettings from "@/components/dashboard/role-settings/role-settings";
import UserPersonas from "@/components/dashboard/role-settings/user-personas";
import SearchInput from "@/components/dashboard/layout/search-input";
import { getRolesList } from "../../../lib/api/roles";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import Button from "@mui/joy/Button";
import AddRoleModal from "../../../components/dashboard/modals/AddRoleModal";
import CircularProgress from "@mui/joy/CircularProgress";
import { useUserInfo } from "@/hooks/use-user-info";

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

  const { userInfo } = useUserInfo();

  const fetchRoles = async () => {
    try {
      const fetchedRoles: Role[] = await getRolesList();
      const transformedRoles: RoleSettingsRole[] = fetchedRoles.map((role) => ({
        id: role.id.toString(),
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

  if (error || !userInfo?.isSuperadmin) {
    const httpError = error as HttpError;
    let status: number | undefined = httpError?.response?.status;

    if (!status && httpError?.message?.includes("status:")) {
      const match = httpError.message.match(/status: (\d+)/);
      status = match ? parseInt(match[1] ?? "0", 10) : undefined;
    }

    if (status === 403 || !userInfo?.isSuperadmin) {
      return (
        <Box sx={{ textAlign: "center", mt: 35 }}>
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
              Role Settings
            </Typography>
          </Stack>
          <Stack>
            <Button
              variant="solid"
              color="primary"
              onClick={handleAddRoleModal}
              startDecorator={<PlusIcon fontSize="var(--Icon-fontSize)" />}
              sx={{
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1, sm: 0.75 },
              }}
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
