"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Avatar from "@mui/joy/Avatar";
import Switch from "@mui/joy/Switch";
import Tooltip from "@mui/joy/Tooltip";
import FormHelperText from "@mui/joy/FormHelperText";
import { Upload as UploadIcon } from "@phosphor-icons/react/dist/ssr/Upload";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Trash as Trash } from "@phosphor-icons/react/dist/ssr/Trash";
import { WarningCircle as WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Box } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { createUser, updateUser, getUserById } from "./../../../lib/api/users";
import { getRoles, Role } from "./../../../lib/api/roles";
import { getCustomers, Customer } from "./../../../lib/api/customers";
import { getManagers, Manager } from "./../../../lib/api/managers";

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

interface AddEditUserProps {
  open: boolean;
  onClose: () => void;
  userId?: number | null;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  customer?: string;
  role?: string;
  additionalEmails?: string[];
}

export default function AddEditUser({ open, onClose, userId }: AddEditUserProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    customer: "",
    role: "",
    persona: "",
    manager: "",
  });
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [emailWarnings, setEmailWarnings] = useState<string[]>([]);
  const { colorScheme } = useColorScheme();
  const isLightTheme = colorScheme === "light";
  const queryClient = useQueryClient();

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: managers, isLoading: isManagersLoading } = useQuery({
    queryKey: ["managers"],
    queryFn: getManagers,
  });

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  const transformUser = (apiUser: any): User => ({
    id: apiUser.id,
    name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
    email: apiUser.email,
    customer: apiUser.customerId ? getCustomerName(apiUser.customerId) : "",
    role: apiUser.roleId ? getRoleName(apiUser.roleId) : "",
    persona: apiUser.persona || "",
    status: apiUser.status,
    avatar: apiUser.avatar || undefined,
    activity: apiUser.activity,
  });

  useEffect(() => {
    if (userId && userData && open) {
      const user = transformUser(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: typeof user.email === "string" ? user.email : user.email[0] || "",
        customer: user.customer || "",
        role: user.role || "",
        persona: user.persona || "",
        manager: userData.managerId ? userData.managerId.toString() : "",
      });
      setAdditionalEmails(
        Array.isArray(user.email) ? user.email.slice(1).filter(Boolean) : []
      );
      setAvatarPreview(user.avatar || null);
      setIsActive(user.status === "active");
      setErrors({});
      setEmailWarnings([]);
    } else if (!userId && open) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        customer: "",
        role: "",
        persona: "",
        manager: "",
      });
      setAdditionalEmails([]);
      setAvatarPreview(null);
      setIsActive(true);
      setErrors({});
      setEmailWarnings([]);
    }
  }, [userId, userData, open]);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailUniqueness = async (email: string, index?: number): Promise<boolean> => {
    if (!email || !validateEmail(email)) return false;
    try {
      
      setEmailWarnings((prev) => {
        const newWarnings = [...prev];
        if (index !== undefined) {
          newWarnings[index] = "";
        } else {
          newWarnings[0] = "";
        }
        return newWarnings;
      });
      return false;
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
      return false;
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.customer) newErrors.customer = "Customer is required";
    if (!formData.role) newErrors.role = "Role is required";

    const additionalEmailErrors = additionalEmails.map((email, index) => {
      if (email && !validateEmail(email)) {
        return "Invalid email format";
      }
      return "";
    });
    if (additionalEmailErrors.some((error) => error)) {
      newErrors.additionalEmails = additionalEmailErrors;
    }

    return newErrors;
  };

  const handleInputChange = async (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
   
    const newErrors: FormErrors = { ...errors };
    if (field === "firstName") {
      newErrors.firstName = value.trim() ? undefined : "First name is required";
    } else if (field === "lastName") {
      newErrors.lastName = value.trim() ? undefined : "Last name is required";
    } else if (field === "email") {
      if (!value.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(value)) {
        newErrors.email = "Invalid email format";
      } else {
        newErrors.email = undefined;
        await checkEmailUniqueness(value);
      }
    } else if (field === "customer") {
      newErrors.customer = value ? undefined : "Customer is required";
    } else if (field === "role") {
      newErrors.role = value ? undefined : "Role is required";
    }
    setErrors(newErrors);
  };

  const handleAddEmail = () => {
    if (additionalEmails.length < 2) {
      setAdditionalEmails([...additionalEmails, ""]);
      setEmailWarnings([...emailWarnings, ""]);
    }
  };

  const handleAdditionalEmailChange = async (index: number, value: string) => {
    const updatedEmails = [...additionalEmails];
    updatedEmails[index] = value;
    setAdditionalEmails(updatedEmails);

    const newErrors = [...(errors.additionalEmails || [])];
    if (value && !validateEmail(value)) {
      newErrors[index] = "Invalid email format";
    } else {
      newErrors[index] = "";
      if (value) {
        await checkEmailUniqueness(value, index);
      }
    }
    setErrors((prev) => ({ ...prev, additionalEmails: newErrors }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 3 * 1024 * 1024) {
      const fileTypes = ["image/png", "image/jpeg", "image/gif"];
      if (fileTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please upload a PNG, JPEG, or GIF file.");
      }
    } else {
      alert("File size must be less than 3MB.");
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarPreview(null);
    setShowDeleteConfirmation(false);
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    const hasEmailWarnings = emailWarnings.some((warning) => warning);
    if (Object.keys(validationErrors).length === 0 && !hasEmailWarnings) {
      const payload = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        status: isActive ? "active" : "inactive" as "active" | "inactive",
        customerId: formData.customer ? getCustomerId(formData.customer) : undefined,
        roleId: formData.role ? getRoleId(formData.role) : undefined,
        managerId: formData.manager ? parseInt(formData.manager) : undefined,
        additionalEmails: additionalEmails.filter((email) => email.trim()),
      };

      if (userId) {
        updateUserMutation.mutate({
          id: userId,
          ...payload,
        });
      } else {
        createUserMutation.mutate(payload);
      }
    }
  };

  const getCustomerId = (customerName: string): number => {
    if (!customers) return 0;
    const customer = customers.find((c) => c.name === customerName);
    return customer ? customer.id : 0;
  };

  const getCustomerName = (customerId: number): string => {
    if (!customers) return "";
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "";
  };

  const getRoleId = (roleName: string): number => {
    if (!roles) return 0;
    const role = roles.find((r) => r.name === roleName);
    return role ? role.id : 0;
  };

  const getRoleName = (roleId: number): string => {
    if (!roles) return "";
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "";
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: 800,
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
          {userId ? "Edit user" : "Add user"}
        </Typography>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              mb={2}
              justifyContent={"space-between"}
            >
              <Box display={"flex"} alignItems={"center"} gap={2}>
                {avatarPreview ? (
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 64, height: 64, borderRadius: "50%" }}
                  />
                ) : (
                  <IconButton
                    component="label"
                    sx={{
                      bgcolor: "#E5E7EB",
                      borderRadius: "50%",
                      width: 64,
                      height: 64,
                      color: "#4F46E5",
                    }}
                  >
                    <UploadIcon fontSize="24px" />
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      hidden
                      onChange={handleAvatarUpload}
                    />
                  </IconButton>
                )}
                <Typography
                  level="body-sm"
                  sx={{
                    fontSize: "12px",
                    color: "#6B7280",
                    lineHeight: "16px",
                  }}
                >
                  Upload Avatar
                  <br />
                  Joyful supports PNGs, JPEGs and GIFs under 3MB
                </Typography>
              </Box>
              <IconButton
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={!avatarPreview}
                sx={{
                  bgcolor: "transparent",
                  color: "#6B7280",
                  "&:hover": { bgcolor: "transparent" },
                }}
              >
                <Trash fontSize="20px" />
              </IconButton>
            </Stack>

            {showDeleteConfirmation && (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  bgcolor: isLightTheme ? "#DDDEE0" : "transparent",
                  borderRadius: "6px",
                  p: 1,
                  justifyContent: "space-between",
                  border: "1px solid var(--joy-palette-divider)",
                }}
              >
                <Typography
                  level="body-md"
                  sx={{
                    fontSize: "14px",
                    color: isLightTheme ? "#272930" : "var(--joy-palette-text-secondary)",
                  }}
                >
                  Are you sure you want to delete image?
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="solid"
                    color="neutral"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    No
                  </Button>
                  <Button
                    variant="solid"
                    color="danger"
                    onClick={handleDeleteAvatar}
                  >
                    Yes
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>

          {userId && (
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Switch
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              <Typography
                level="body-sm"
                sx={{ fontSize: "14px", color: "#6B7280" }}
              >
                Active
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={2}>
            <Stack sx={{ flex: 1 }}>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                First Name
              </Typography>
              <Input
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={!!errors.firstName}
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.firstName && (
                <FormHelperText sx={{ color: "var(--joy-palette-danger-500)", fontSize: '12px' }}>
                  {errors.firstName}
                </FormHelperText>
              )}
            </Stack>
            <Stack sx={{ flex: 1 }}>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Last Name
              </Typography>
              <Input
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={!!errors.lastName}
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.lastName && (
                <FormHelperText sx={{ color: "var(--joy-palette-danger-500)", fontSize: '12px' }}>
                  {errors.lastName}
                </FormHelperText>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Stack sx={{ flex: 1 }}>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Email
              </Typography>
              <Input
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!errors.email}
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.email && (
                <FormHelperText sx={{ color: "var(--joy-palette-danger-500)", fontSize: '12px' }}>
                  {errors.email}
                </FormHelperText>
              )}
              {emailWarnings[0] && (
                <FormHelperText sx={{ color: "var(--joy-palette-warning-500)", fontSize: '12px' }}>
                  {emailWarnings[0]}
                </FormHelperText>
              )}
            </Stack>
            <Stack sx={{ flex: 1 }}>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Customer
              </Typography>
              <Select
                placeholder="Select customer"
                value={formData.customer}
                onChange={(e, newValue) =>
                  handleInputChange("customer", newValue as string)
                }
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                  border: errors.customer ? "1px solid var(--joy-palette-danger-500)" : undefined,
                }}
              >
                {customers?.map((customer) => (
                  <Option key={customer.id} value={customer.name}>
                    {customer.name}
                  </Option>
                ))}
              </Select>
              {errors.customer && (
                <FormHelperText sx={{ color: "var(--joy-palette-danger-500)", fontSize: '12px' }}>
                  {errors.customer}
                </FormHelperText>
              )}
            </Stack>
          </Stack>

          {additionalEmails.map((email, index) => (
            <Stack key={index}>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Additional Email {index + 1}
              </Typography>
              <Input
                placeholder="Enter additional email"
                value={email}
                onChange={(e) =>
                  handleAdditionalEmailChange(index, e.target.value)
                }
                error={!!errors.additionalEmails?.[index]}
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.additionalEmails?.[index] && (
                <FormHelperText sx={{ color: "var(--joy-palette-danger-500)", fontSize: '12px' }}>
                  {errors.additionalEmails[index]}
                </FormHelperText>
              )}
              {emailWarnings[index + 1] && (
                <FormHelperText sx={{ color: "var(--joy-palette-warning-500)", fontSize: '12px' }}>
                  {emailWarnings[index + 1]}
                </FormHelperText>
              )}
            </Stack>
          ))}

          <Stack direction="row" spacing={2}>
            <Stack sx={{ flex: 1 }}>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Role
              </Typography>
              <Select
                placeholder="Select role"
                value={formData.role}
                onChange={(e, newValue) =>
                  handleInputChange("role", newValue as string)
                }
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                  border: errors.role ? "1px solid var(--joy-palette-danger-500)" : undefined,
                }}
              >
                {roles?.map((role) => (
                  <Option key={role.id} value={role.name}>
                    {role.name}
                  </Option>
                ))}
              </Select>
              {errors.role && (
                <FormHelperText sx={{ color: "var(--joy-palette-danger-500)", fontSize: '12px' }}>
                  {errors.role}
                </FormHelperText>
              )}
            </Stack>
            <Stack sx={{ flex: 1 }}>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Persona
              </Typography>
              <Select
                placeholder="Select persona"
                value={formData.persona}
                onChange={(e, newValue) =>
                  handleInputChange("persona", newValue as string)
                }
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <Option value="Education">Education</Option>
                <Option value="Titles">Titles</Option>
                <Option value="Experience">Experience</Option>
                <Option value="Responsibilities">Responsibilities</Option>
                <Option value="Customer admin">Customer admin</Option>
                <Option value="User">User</Option>
              </Select>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Stack sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  level="body-sm"
                  sx={{
                    fontSize: "14px",
                    color: "var(--joy-palette-text-primary)",
                    mb: 0.5,
                    fontWeight: 500,
                  }}
                >
                  Manager
                </Typography>
                <Tooltip
                  title="You can’t select a manager if your role is set as Manager"
                  placement="top"
                  sx={{
                    background: "#DAD8FD",
                    color: "#3D37DD",
                    width: "206px",
                  }}
                >
                  <Box sx={{ background: "none", cursor: "pointer" }}>
                    <WarningCircle fontSize="16px" color="#6B7280" />
                  </Box>
                </Tooltip>
              </Box>
              <Select
                placeholder="Select manager"
                value={formData.manager}
                onChange={(e, newValue) =>
                  handleInputChange("manager", newValue as string)
                }
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <Option value="">None</Option>
                {managers?.map((manager) => (
                  <Option key={manager.id} value={manager.id.toString()}>
                    {manager.name}
                  </Option>
                ))}
              </Select>
            </Stack>
            <Stack sx={{ flex: 1 }}></Stack>
          </Stack>

          <Button
            variant="plain"
            startDecorator={<PlusIcon fontSize="16px" />}
            onClick={handleAddEmail}
            disabled={additionalEmails.length >= 2}
            sx={{
              alignSelf: "flex-start",
              fontSize: "14px",
              fontWeight: 500,
              p: 0,
            }}
          >
            Add Email
          </Button>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handleSave}
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
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
              Save
            </Button>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}