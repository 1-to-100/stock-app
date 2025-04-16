"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Switch from "@mui/joy/Switch";
import { getSystemModules } from "./../../../lib/api/system-modules";
import { createRole, addRolePermissions } from "../../../lib/api/roles";

interface AddRoleModalProps {
    open: boolean;
    onClose: () => void;
    onRoleCreated?: () => void;
}

interface Permission {
    enabled: boolean;
    accessLevel: string[];
}

interface FormData {
    roleName: string;
    description: string;
    permissions: { [key: string]: Permission };
}

export interface Role {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

interface CreateRolePayload {
    name: string;
    description: string;
}

interface AddRolePermissionsPayload {
    id: number;
    permissionNames: string[];
}

export default function AddRoleModal({ open, onClose, onRoleCreated }: AddRoleModalProps) {
    const [formData, setFormData] = useState<FormData>({
        roleName: "",
        description: "",
        permissions: {},
    });

    const { data: systemModules, isLoading } = useQuery({
        queryKey: ["systemModules"],
        queryFn: getSystemModules,
    });

    useEffect(() => {
        if (systemModules && open) {
            const initialPermissions: { [key: string]: Permission } = {};
            systemModules.forEach((module) => {
                initialPermissions[module.name] = {
                    enabled: module.enabled ?? false,
                    accessLevel: [],
                };
            });
            setFormData((prev) => ({
                ...prev,
                permissions: initialPermissions,
            }));
        }
    }, [systemModules, open]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePermissionToggle = (permissionKey: string) => {
        setFormData((prev) => {
            const currentPermission = prev.permissions[permissionKey] || {
                enabled: false,
                accessLevel: [],
            };
            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [permissionKey]: {
                        ...currentPermission,
                        enabled: !currentPermission.enabled,
                    },
                },
            };
        });
    };

    const handleAccessLevelChange = (permissionKey: string, value: string[]) => {
        setFormData((prev) => {
            const currentPermission = prev.permissions[permissionKey] || {
                enabled: false,
                accessLevel: [],
            };
            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [permissionKey]: {
                        ...currentPermission,
                        accessLevel: value,
                    },
                },
            };
        });
    };

    const handleSave = async () => {
        try {
            const rolePayload: CreateRolePayload = {
                name: formData.roleName,
                description: formData.description,
            };
            const createdRole = await createRole(rolePayload);
        
            const permissionNames: string[] = [];
            Object.entries(formData.permissions).forEach(([moduleName, permission]) => {
                if (permission.enabled && permission.accessLevel.length > 0) {
                    permission.accessLevel.forEach((perm) => {
                        const prefix = `${moduleName}:`;
                        const cleanPerm = perm.startsWith(prefix) ? perm.slice(prefix.length) : perm;
                        permissionNames.push(`${moduleName}:${cleanPerm}`);
                    });
                }
            });

            if (permissionNames.length > 0) {
                const permissionsPayload: AddRolePermissionsPayload = {
                    id: createdRole.id,
                    permissionNames,
                };
                await addRolePermissions(permissionsPayload);
            }
           
            if (onRoleCreated) {
                onRoleCreated();
            }
            onClose();
        } catch (error) {
            console.error("Error creating role or adding permissions:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                sx={{
                    width: 500,
                    p: 3,
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <ModalClose sx={{ color: "#6B7280" }} />
                <Typography
                    level="h3"
                    sx={{
                        fontSize: "24px",
                        fontWeight: 600,
                        color: "var(--joy-palette-text-primary)",
                        mb: 2,
                    }}
                >
                    Add Role
                </Typography>
                <Stack spacing={2}>
                    <Stack>
                        <Typography
                            level="body-sm"
                            sx={{
                                fontSize: "14px",
                                color: "var(--joy-palette-text-primary)",
                                mb: 0.5,
                                fontWeight: 500,
                            }}
                        >
                            Role name
                        </Typography>
                        <Input
                            placeholder="Enter role name"
                            value={formData.roleName}
                            onChange={(e) => handleInputChange("roleName", e.target.value)}
                            sx={{
                                borderRadius: "6px",
                                fontSize: "14px",
                            }}
                        />
                    </Stack>

                    <Stack>
                        <Typography
                            level="body-sm"
                            sx={{
                                fontSize: "14px",
                                color: "var(--joy-palette-text-primary)",
                                mb: 0.5,
                                fontWeight: 500,
                            }}
                        >
                            About
                        </Typography>
                        <Textarea
                            placeholder="Describe this role’s permissions and responsibilities"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            minRows={3}
                            sx={{
                                borderRadius: "6px",
                                fontSize: "14px",
                            }}
                        />
                    </Stack>

                    <Stack spacing={1}>
                        <Typography
                            level="body-sm"
                            sx={{
                                fontSize: "14px",
                                color: "var(--joy-palette-text-secondary)",
                                mb: 0.5,
                                fontWeight: 500,
                            }}
                        >
                            Permission
                        </Typography>
                        {isLoading ? (
                            <Typography>Loading permissions...</Typography>
                        ) : (
                            systemModules?.map((module) => {
                                const selectedPermissions =
                                    formData.permissions[module.name]?.accessLevel || [];
                                return (
                                    <Stack key={module.name} spacing={1}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Switch
                                                checked={
                                                    formData.permissions[module.name]?.enabled || false
                                                }
                                                onChange={() => handlePermissionToggle(module.name)}
                                            />
                                            <Typography
                                                level="body-sm"
                                                sx={{ fontSize: "14px", color: "#6B7280", flex: 1 }}
                                            >
                                                {module.label}
                                            </Typography>
                                            <Select
                                                multiple
                                                value={selectedPermissions}
                                                onChange={(e, newValue) =>
                                                    handleAccessLevelChange(module.name, newValue as string[])
                                                }
                                                placeholder="Select permissions"
                                                disabled={!formData.permissions[module.name]?.enabled}
                                                renderValue={(selected) => {
                                                    if (selected.length === 0) {
                                                        return (
                                                            <Typography
                                                                sx={{
                                                                    color: "var(--joy-palette-text-primary)",
                                                                    fontSize: "14px",
                                                                }}
                                                            >
                                                                Select permissions
                                                            </Typography>
                                                        );
                                                    }
                                                    return (
                                                        <Typography
                                                            sx={{
                                                                color: "var(--joy-palette-text-primary)",
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            Selected permissions: {selected.length}
                                                        </Typography>
                                                    );
                                                }}
                                                sx={{
                                                    borderRadius: "6px",
                                                    fontSize: "14px",
                                                    minWidth: "120px",
                                                    "& .MuiSelect-placeholder": {
                                                        fontSize: "14px",
                                                        color: "var(--joy-palette-text-primary)",
                                                    },
                                                }}
                                                slotProps={{
                                                    listbox: {
                                                        sx: {
                                                            fontSize: "13px",
                                                            "& .MuiOption-root.Mui-selected": {
                                                                fontSize: "12px",
                                                                color: "var(--joy-palette-text-primary)",
                                                                "&:after": {
                                                                    content: '"✓"',
                                                                    marginRight: "8px",
                                                                    color: "#4F46E5",
                                                                },
                                                            },
                                                        },
                                                    },
                                                }}
                                            >
                                                {module.permissions
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((permission) => (
                                                        <Option key={permission.name} value={permission.name}>
                                                            {permission.label}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </Stack>
                                        {selectedPermissions.length > 0 && (
                                            <Stack spacing={0.5} sx={{ ml: "auto" }}>
                                                {selectedPermissions.map((permName) => {
                                                    const permission = module.permissions.find(
                                                        (p) => p.name === permName
                                                    );
                                                    return (
                                                        <Typography
                                                            key={permName}
                                                            level="body-sm"
                                                            sx={{
                                                                fontSize: "14px",
                                                                color: "#4F46E5",
                                                            }}
                                                        >
                                                            {permission?.label || permName}
                                                        </Typography>
                                                    );
                                                })}
                                            </Stack>
                                        )}
                                    </Stack>
                                );
                            })
                        )}
                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleSave}
                            sx={{
                                borderRadius: "20px",
                                bgcolor: "#4F46E5",
                                color: "#FFFFFF",
                                fontWeight: 500,
                                px: 3,
                                py: 1,
                                "&:hover": { bgcolor: "#4338CA" },
                            }}
                        >
                            Create role
                        </Button>
                    </Stack>
                </Stack>
            </ModalDialog>
        </Modal>
    );
}