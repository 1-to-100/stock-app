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

export interface Role {
    id: number;
    name: string;
    description: string | null;
}

export interface RoleSettingsRole {
    id: string;
    abbreviation: string;
    name: string;
    description: string;
    peopleCount: number;
}

export default function Page(): React.JSX.Element {
    const [roles, setRoles] = useState<RoleSettingsRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [openAddRoleModal, setOpenAddRoleModal] = useState(false);

    const fetchRoles = async () => {
        try {
            const fetchedRoles: Role[] = await getRoles();
            const transformedRoles: RoleSettingsRole[] = fetchedRoles.map(
                (role) => ({
                    id: role.id.toString(),
                    abbreviation: role.name.slice(0, 2).toUpperCase(),
                    name: role.name,
                    description: role.description || "No description provided",
                    peopleCount: 0,
                })
            );
            setRoles(transformedRoles);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            setRoles([]);
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

    return (
        <Box sx={{ p: "var(--Content-padding)" }}>
            <SearchInput
                onSearch={handleSearch}
                style={{ position: "fixed", top: "4%", zIndex: "1000" }}
            />
            <Stack spacing={3}>
                <Stack display={"flex"} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
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
                    <Typography>Loading...</Typography>
                ) : roles.length > 0 ? (
                    <RoleSettings roles={roles} />
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