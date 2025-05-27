import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { useState } from "react";
import { Tabs, TabList, Tab, Input, IconButton } from "@mui/joy";
import { Trash as Trash } from "@phosphor-icons/react/dist/ssr/Trash";
import { Copy as CopyIcon } from "@phosphor-icons/react/dist/ssr/Copy";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/lib/api/roles";
import { getCustomers } from "@/lib/api/customers";
import { inviteUser, inviteMultipleUsers } from "@/lib/api/users";
import { toast } from "@/components/core/toaster";

interface InviteUserProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export default function InviteUser({
  open,
  onClose,
  onConfirm,
}: InviteUserProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [viewMode, setViewMode] = React.useState<"email" | "magic">("email");
  const [emailInput, setEmailInput] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const { data: customers, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
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

  const handleEmailKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && emailInput.trim() !== "") {
      const emailError = validateEmail(emailInput.trim());
      if (emailError) {
        setError(emailError);
        return;
      }
      setEmails([...emails, emailInput.trim()]);
      setEmailInput("");
      setError("");
      event.preventDefault();
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
    setError("");
  };

  const handleDeleteEmail = (emailToDelete: string) => {
    setEmails(emails.filter((email) => email !== emailToDelete));
  };

  const onCancel = () => {
    setSelectedRole("");
    setSelectedCustomer("");
    setEmailInput("");
    setEmails([]);
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!selectedRole || !selectedCustomer) {
      return;
    }

    setError("");

    if (emailInput.trim() !== "") {
      const emailError = validateEmail(emailInput.trim());
      if (emailError) {
        setError(emailError);
        return;
      }
      setEmails([...emails, emailInput.trim()]);
      setEmailInput("");
    }

    const emailErrors = emails.map((email) => validateEmail(email));
    const hasErrors = emailErrors.some((error) => error !== null);
    if (hasErrors) {
      setError("One or more email addresses are invalid");
      return;
    }

    setIsLoading(true);
    try {
      const roleId = roles?.find((role) => role.name === selectedRole)?.id;
      const customerId = customers?.find(
        (customer) => customer.name === selectedCustomer
      )?.id;

      if (!roleId || !customerId) {
        throw new Error("Role or customer not found");
      }

      const emailsToInvite =
        emailInput.trim() !== "" ? [...emails, emailInput.trim()] : emails;

      if (emailsToInvite.length === 1) {
        const email = emailsToInvite[0];
        if (!email) {
          throw new Error("Email is required");
        }
        await inviteUser({
          email,
          customerId,
          roleId,
        });
        toast.success(`User ${email} has been successfully invited`);
      } else {
        await inviteMultipleUsers({
          emails: emailsToInvite,
          customerId,
          roleId,
        });
        toast.success(
          `Users have been successfully invited:\n${emailsToInvite.join("\n")}`
        );
      }

      onConfirm();
      onClose();
    } catch (error) {
      const apiError = error as { response?: { data: ApiError } };
      if (apiError.response?.data) {
        setError(apiError.response.data.message);
      } else {
        setError("Failed to invite user. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const magicLink = "";

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          maxWidth: 520,
          width: "100%",
          borderRadius: "8px",
          p: 3,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ModalClose
          sx={{
            top: 8,
            right: 8,
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          <XIcon fontSize="var(--Icon-fontSize)" />
        </ModalClose>
        <Typography level="h4" sx={{ mb: 0 }}>
          Invite user
        </Typography>

        <Stack spacing={0.5}>
          <Typography
            level="body-sm"
            fontWeight="500"
            sx={{ color: "var(--joy-palette-text-primary)", mt: 1 }}
          >
            Role
          </Typography>
          <Select
            value={selectedRole}
            onChange={(event, newValue) => setSelectedRole(newValue as string)}
            placeholder="Select role"
            sx={{
              bgcolor: "var(--joy-palette-background-level1)",
              "&:hover": { bgcolor: "var(--joy-palette-background-level1)" },
            }}
          >
            {roles?.map((role) => (
              <Option key={role.id} value={role.name}>
                {role.name}
              </Option>
            ))}
          </Select>

          <Typography
            level="body-sm"
            fontWeight="500"
            sx={{ color: "var(--joy-palette-text-primary)", mt: 1 }}
          >
            Customer
          </Typography>
          <Select
            value={selectedCustomer}
            onChange={(event, newValue) =>
              setSelectedCustomer(newValue as string)
            }
            placeholder="Select customer"
            sx={{
              bgcolor: "var(--joy-palette-background-level1)",
              "&:hover": { bgcolor: "var(--joy-palette-background-level1)" },
            }}
          >
            {customers &&
              customers?.map((customer) => (
                <Option key={customer.id} value={customer.name}>
                  {customer?.name.slice(0, 45)}
                </Option>
              ))}
          </Select>

          <Tabs
            value={viewMode}
            variant="custom"
            onChange={(event, newValue) =>
              setViewMode(newValue as "email" | "magic")
            }
            sx={{ mt: 2, mb: 2 }}
          >
            <TabList
              sx={{
                display: "flex",
                gap: 1,
                p: 0,
                "& .MuiTab-root": {
                  borderRadius: "20px",
                  minWidth: "40px",
                  p: 1,
                  color: "var(--joy-palette-text-secondary)",
                  "&[aria-selected='true']": {
                    border: "1px solid var(--joy-palette-divider)",
                    color: "var(--joy-palette-text-primary)",
                  },
                },
              }}
            >
              <Tab value="email">Invite via email</Tab>
              <Tab value="magic">Invite via magic link</Tab>
            </TabList>
          </Tabs>

          {viewMode === "email" ? (
            <>
              <Typography
                level="body-sm"
                sx={{
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  mb: 0.5,
                  fontWeight: 500,
                }}
              >
                Enter email
              </Typography>
              <Input
                type="email"
                placeholder="Enter email"
                value={emailInput}
                onChange={handleEmailChange}
                onKeyPress={handleEmailKeyPress}
                error={!!error}
                sx={{
                  borderRadius: "6px",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": {
                    color: "var(--joy-palette-text-secondary)",
                  },
                }}
              />
              {error && (
                <Typography
                  level="body-sm"
                  sx={{
                    color: "var(--joy-palette-danger-500)",
                    mt: 0.5,
                    fontSize: "12px",
                  }}
                >
                  {error}
                </Typography>
              )}
              <Stack spacing={1} sx={{ mt: 1 }}>
                {emails.map((email, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1, color: "var(--joy-palette-text-primary)" }}
                  >
                    <Typography
                      sx={{
                        color: "var(--joy-palette-text-primary)",
                        fontSize: "16px",
                      }}
                    >
                      {email}
                    </Typography>
                    <IconButton
                      onClick={() => handleDeleteEmail(email)}
                      sx={{
                        bgcolor: "transparent",
                        color: "var(--joy-palette-text-primary)",
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    >
                      <Trash fontSize="20px" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </>
          ) : (
            <Input
              readOnly
              value={magicLink}
              endDecorator={
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(magicLink);
                  }}
                  sx={{ color: "var(--joy-palette-text-secondary)" }}
                >
                  <CopyIcon fontSize="20px" />
                </IconButton>
              }
              sx={{
                fontSize: "16px",
                color: "var(--joy-palette-text-secondary)",
                fontWeight: 400,
                mt: 1,
                mb: 1,
                background: "var(--joy-palette-background-level1)",
              }}
            />
          )}

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handleConfirm}
              loading={isLoading}
              disabled={!selectedRole || !selectedCustomer || (emails.length === 0 && !emailInput.trim())}
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
              Invite
            </Button>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
