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
import FormHelperText from "@mui/joy/FormHelperText";
import { Box, Divider } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "../../../lib/api/customers";
import { getManagers } from "@/lib/api/managers";
import { getSubscriptions } from "../../../lib/api/customers";
import { Customer } from "@/contexts/auth/types";
import { toast } from "@/components/core/toaster";
import { getStatuses } from "@/lib/api/users";

interface HttpError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface AddEditCustomerProps {
  open: boolean;
  onClose: () => void;
  customerId?: number | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  managerId?: string;
  subscriptionId?: string;
  status?: string;
}

export default function AddEditCustomer({
  open,
  onClose,
  customerId,
}: AddEditCustomerProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    managerId: number | null;
    subscriptionId: number | null;
    status: string;
  }>({
    name: "",
    email: "",
    managerId: null,
    subscriptionId: null,
    status: "",
  });

  const [isActive, setIsActive] = useState<boolean>(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors | null>(null);
  const [emailWarnings, setEmailWarnings] = useState<string[]>([]);
  const { colorScheme } = useColorScheme();
  const isLightTheme = colorScheme === "light";
  const queryClient = useQueryClient();

  const { data: managers, isLoading: isManagersLoading } = useQuery({
    queryKey: ["managers"],
    queryFn: getManagers,
    enabled: open,
  });

  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    enabled: open,
  });

  const { data: customerData, isLoading: isUserLoading } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => getCustomerById(customerId!),
    enabled: !!customerId && open,
  });

  const { data: statuses, isLoading: isStatusesLoading } = useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    enabled: open,
  });

  useEffect(() => {
    if (customerId && customerData && open) {
      setFormData({
        name: customerData.name || "",
        email:
          typeof customerData.email === "string"
            ? customerData.email
            : customerData.email[0] || "",
        subscriptionId: customerData.subscriptionId ?? null,
        managerId: customerData.manager.id ?? null,
        status: customerData.status || "",
      });
      setErrors(null);
      setEmailWarnings([]);
    } else if (!customerId && open) {
      setFormData({
        name: "",
        email: "",
        managerId: null,
        subscriptionId: null,
        status: "",
      });
      setIsActive(false);
      setErrors(null);
      setEmailWarnings([]);
    }
  }, [customerId, customerData, open]);

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onClose();
      toast.success("Customer created successfully.");
    },
    onError: (error: HttpError) => {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred while creating the customer.");
      }
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", customerId] });
      await queryClient.refetchQueries({ queryKey: ["customers", customerId] });
      onClose();
      toast.success("Customer updated successfully.");
    },
    onError: (error: HttpError) => {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred while updating the customer.");
      }
    },
  });

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (email.startsWith(".") || email.endsWith(".")) {
      return "Invalid email format";
    }

    if (email.includes("..")) {
      return "Invalid email format";
    }

    if (email.includes("/")) {
      return "Invalid email format";
    }

    const atIndex = email.indexOf("@");
    if (email[atIndex - 1] === ".") {
      return "Invalid email format";
    }

    return null;
  };

  const checkEmailUniqueness = async (
    email: string,
    index?: number
  ): Promise<boolean> => {
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

    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    if (!formData.managerId) {
      newErrors.managerId = "Manager is required";
    }

    if (!formData.subscriptionId) {
      newErrors.subscriptionId = "Subscription is required";
    }

    return newErrors;
  };

  const handleInputChange = async (
    field: string,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    if (field === "email" && typeof value === "string") {
      const emailError = validateEmail(value);
      if (emailError) {
        setErrors((prev) => ({ ...prev, email: emailError }));
      }
    }
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    const hasEmailWarnings = emailWarnings.some((warning) => warning);
    if (Object.keys(validationErrors).length === 0 && !hasEmailWarnings) {
      const payload = {
        email: formData.email,
        name: formData.name,
        status: isActive ? "active" : ("inactive" as "active" | "inactive"),
        managerId: formData.managerId ?? undefined,
        subscriptionId: formData.subscriptionId ?? undefined,
      };

      if (customerId) {
        updateCustomerMutation.mutate({
          id: customerId,
          ...payload,
        });
      } else {
        createCustomerMutation.mutate(payload);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: 520,
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
          {customerId ? "Edit customer" : "Add customer"}
        </Typography>
        <Stack spacing={2}>
          {customerId && (
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
                Status
              </Typography>
              <Select
                placeholder="Select status"
                value={formData.status}
                onChange={(e, newValue) =>
                  handleInputChange("status", newValue)
                }
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                  border: errors?.status
                    ? "1px solid var(--joy-palette-danger-500)"
                    : undefined,
                }}
              >
                {statuses &&
                  statuses.map((status, index) => (
                    <Option key={index} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Option>
                  ))}
              </Select>
            </Stack>
          )}
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
              Customer Name
            </Typography>
            <Input
              placeholder="Enter customer name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors?.name}
              slotProps={{ input: { maxLength: 255 } }}
              sx={{
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors?.name && (
              <FormHelperText
                sx={{
                  color: "var(--joy-palette-danger-500)",
                  fontSize: "12px",
                }}
              >
                {errors.name}
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
              Email
            </Typography>
            <Input
              placeholder="Enter email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors?.email}
              slotProps={{ input: { maxLength: 255 } }}
              sx={{
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors?.email && (
              <FormHelperText
                sx={{
                  color: "var(--joy-palette-danger-500)",
                  fontSize: "12px",
                }}
              >
                {errors.email}
              </FormHelperText>
            )}
            {emailWarnings[0] && (
              <FormHelperText
                sx={{
                  color: "var(--joy-palette-warning-500)",
                  fontSize: "12px",
                }}
              >
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
              Subscription
            </Typography>
            <Select
              placeholder="Select subscription"
              value={formData.subscriptionId}
              onChange={(e, newValue) =>
                handleInputChange("subscriptionId", newValue)
              }
              sx={{
                borderRadius: "6px",
                fontSize: "14px",
                border: errors?.subscriptionId
                  ? "1px solid var(--joy-palette-danger-500)"
                  : undefined,
              }}
            >
              {subscriptions &&
                subscriptions?.map((subscription) => (
                  <Option key={subscription.id} value={subscription.id}>
                    {subscription.name}
                  </Option>
                ))}
            </Select>
            {errors?.subscriptionId && (
              <FormHelperText
                sx={{
                  color: "var(--joy-palette-danger-500)",
                  fontSize: "12px",
                }}
              >
                {errors.subscriptionId}
              </FormHelperText>
            )}
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
                Support manager
              </Typography>
              <Select
                placeholder="Select user"
                value={formData.managerId}
                onChange={(e, newValue) =>
                  handleInputChange("managerId", newValue)
                }
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                  border: errors?.managerId
                    ? "1px solid var(--joy-palette-danger-500)"
                    : undefined,
                }}
              >
                {managers &&
                  managers.map((manager) => (
                    <Option key={manager.id} value={manager.id}>
                      {manager.name}
                    </Option>
                  ))}
              </Select>
              {errors?.managerId && (
                <FormHelperText
                  sx={{
                    color: "var(--joy-palette-danger-500)",
                    fontSize: "12px",
                  }}
                >
                  {errors.managerId}
                </FormHelperText>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handleSave}
              disabled={
                createCustomerMutation.isPending ||
                updateCustomerMutation.isPending
              }
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
              {customerId ? "Save" : "Add customer"}
            </Button>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
