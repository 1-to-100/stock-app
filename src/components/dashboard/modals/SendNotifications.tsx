"use client";

import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import FormHelperText from "@mui/joy/FormHelperText";
import { getCustomers } from "@/lib/api/customers";
import { getUsers } from "@/lib/api/users";
import { sendNotification } from "@/lib/api/notifications";
import { toast } from "@/components/core/toaster";
import { queryClient } from "@/lib/react-query";

interface SendNotificationsProps {
  open: boolean;
  onClose: () => void;
  selectedNotificationId: number;
}

export default function SendNotifications({ open, onClose, selectedNotificationId }: SendNotificationsProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<"users" | "customers">("users");
  const [error, setError] = useState<{ customer?: string; user?: string; type?: string }>({});

  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users", 1],
    queryFn: () => getUsers({ page: 1, perPage: 100 }),
  });
  const users = usersData?.data || [];

  const handleSend = async (selectedNotificationId: number) => {
    let hasError = false;
    const newError: { customer?: string; user?: string; type?: string } = {};
    if (selectedType === "users" && selectedUser.length === 0) {
      newError.user = "User is required";
      hasError = true;
    }
    if (selectedType === "customers" && !selectedCustomer) {
      newError.customer = "Customer is required";
      hasError = true;
    }
    setError(newError);
    if (!hasError) {
      await sendNotification({
        customerId: selectedCustomer.length > 0 ? parseInt(selectedCustomer[0] ?? "0", 10) : 0,
        userIds: selectedUser.map(id => parseInt(id, 10)),
      }, selectedNotificationId);
      toast.success("Notifications has been sent successfully.");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: "90%", sm: 400 },
          maxWidth: "100%",
          p: { xs: 2, sm: 3 },
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <ModalClose sx={{ color: "#6B7280" }} />
        <Typography
          level="h3"
          sx={{
            fontSize: { xs: "20px", sm: "22px", md: "24px" },
            fontWeight: 600,
            color: "var(--joy-palette-text-primary)",
            mb: { xs: 1.5, sm: 2 },
          }}
        >
          Send notifications
        </Typography>
        <Stack spacing={2}>
          <Stack>
            <Typography
              level="body-sm"
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
                color: "var(--joy-palette-text-primary)",
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Send to
            </Typography>
            <Select
              placeholder="Select type"
              value={selectedType}
              onChange={(_, newValue) => {
                setSelectedType(newValue as "users" | "customers");
                setSelectedUser([]);
                setSelectedCustomer([]);
              }}
              sx={{
                borderRadius: "6px",
                fontSize: { xs: "12px", sm: "14px" },
              }}
            >
              <Option value="users">Users</Option>
              <Option value="customers">Customers</Option>
            </Select>
          </Stack>
          {selectedType === "users" ? (
            <Stack>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Select recipients
              </Typography>
              <Select
                placeholder="Select users"
                value={selectedUser}
                multiple
                onChange={(_, newValue) => setSelectedUser(newValue as string[])}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return (
                      <Typography
                        sx={{
                          color: "var(--joy-palette-text-primary)",
                          fontSize: "14px",
                        }}
                      >
                        Select users
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
                      Selected users: {selected.length}
                    </Typography>
                  );
                }}
                sx={{
                  borderRadius: "6px",
                  fontSize: { xs: "12px", sm: "14px" },
                  border: error.user ? "1px solid var(--joy-palette-danger-500)" : undefined,
                  "& .MuiSelect-placeholder": {
                    fontSize: { xs: "12px", sm: "14px" },
                    color: "var(--joy-palette-text-primary)",
                  },
                }}
                disabled={isUsersLoading}
              >
                {users && users.map((user) => (
                  <Option key={user.id} value={user.id.toString()}>
                    {user.firstName?.slice(0, 10)} {user.lastName?.slice(0, 10)}
                  </Option>
                ))}
              </Select>
              {error.user && (
                <FormHelperText sx={{ color: "var(--joy-palette-danger-500)", fontSize: { xs: "10px", sm: "12px" } }}>{error.user}</FormHelperText>
              )}
              {selectedUser.length > 0 && (
                <Stack
                  spacing={0.5}
                  sx={{
                    maxHeight: "100px",
                    overflowY: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {selectedUser.map((userId) => {
                    const user = users.find((u) => u.id.toString() === userId);
                    return (
                      <Typography
                        key={userId}
                        level="body-sm"
                        sx={{
                          fontSize: "12px",
                          color: "#4F46E5",
                          borderRadius: "5px",
                          border: "1px solid #4F46E5",
                          width: "fit-content",
                          padding: "3px 5px",
                        }}
                      >
                        {user ? `${user.firstName} ${user.lastName}` : userId}
                      </Typography>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          ) : (
            <Stack>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Select recipients
              </Typography>
              <Select
                placeholder="Select customers"
                value={selectedCustomer}
                multiple
                onChange={(_, newValue) => setSelectedCustomer(newValue as string[])}
                sx={{
                  borderRadius: "6px",
                  fontSize: { xs: "12px", sm: "14px" },
                  border: error.customer ? "1px solid var(--joy-palette-danger-500)" : undefined,
                }}
                disabled={isCustomersLoading}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return (
                      <Typography sx={{ color: "var(--joy-palette-text-primary)", fontSize: "14px" }}>Select customers</Typography>
                    );
                  }
                  return <Typography sx={{ color: "var(--joy-palette-text-primary)", fontSize: "14px" }}>Selected customers: {selected.length}</Typography>;
                }}
              >
                {customers && customers.map((customer) => (
                  <Option key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </Option>
                ))}
              </Select>
              {error.customer && (
                <FormHelperText sx={{ color: "var(--joy-palette-danger-500)", fontSize: { xs: "10px", sm: "12px" } }}>{error.customer}</FormHelperText>
              )}
              {selectedCustomer.length > 0 && (
                <Stack
                  spacing={0.5}
                  sx={{
                    maxHeight: "100px",
                    overflowY: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {selectedCustomer.map((customerId) => {
                    const customer = customers?.find((c) => c.id.toString() === customerId);
                    return (
                      <Typography
                        key={customerId}
                        level="body-sm"
                        sx={{
                          fontSize: "12px",
                          color: "#4F46E5",
                          borderRadius: "5px",
                          border: "1px solid #4F46E5",
                          width: "fit-content",
                          padding: "3px 5px",
                        }}
                      >
                        {customer ? customer.name : customerId}
                      </Typography>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          )}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ fontSize: { xs: "12px", sm: "14px" }, px: { xs: 2, sm: 3 }, width: { xs: "100%", sm: "auto" } }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={() => handleSend(selectedNotificationId)}
              disabled={selectedCustomer.length === 0 && selectedUser.length === 0}
              sx={{
                borderRadius: "20px",
                bgcolor: "#4F46E5",
                color: "#FFFFFF",
                fontWeight: 500,
                fontSize: { xs: "12px", sm: "14px" },
                px: { xs: 2, sm: 3 },
                py: 1,
                "&:hover": { bgcolor: "#4338CA" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  );
} 