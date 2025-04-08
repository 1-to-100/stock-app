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

interface InviteUserProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  onConfirm: (reason: string, customReason?: string) => void;
}

export default function InviteUser({
  open,
  onClose,
  onConfirm,
}: InviteUserProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [viewMode, setViewMode] = React.useState<"email" | "magic">("email");
  const [emailInput, setEmailInput] = useState<string>(""); 
  const [emails, setEmails] = useState<string[]>([]); 

  const reasons = [
    "Customer Administrators",
    "User",
  ];
  
  const handleEmailKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && emailInput.trim() !== "") {
      setEmails([...emails, emailInput.trim()]); 
      setEmailInput(""); 
      event.preventDefault(); 
    }
  };
  
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
  };

  const handleDeleteEmail = (emailToDelete: string) => {
    setEmails(emails.filter((email) => email !== emailToDelete));
  };

  const handleConfirm = () => {
    onConfirm(
      selectedReason,
      selectedReason === "Other" ? customReason : undefined
    );
    onClose();
  };

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
            value={selectedReason}
            onChange={(event, newValue) =>
              setSelectedReason(newValue as string)
            }
            placeholder="Select role"
            sx={{
              bgcolor: "var(--joy-palette-background-level1)",
              "&:hover": { bgcolor: "var(--joy-palette-background-level1)" },
            }}
          >
            {reasons.map((reason, index) => (
              <Option key={index} value={reason}>
                {reason}
              </Option>
            ))}
          </Select>

          <Typography
            level="body-sm"
            fontWeight="500"
            sx={{ color: "var(--joy-palette-text-primary)", mt: 1 }}
          >
            Persona
          </Typography>
          <Select
            value={selectedReason}
            onChange={(event, newValue) =>
              setSelectedReason(newValue as string)
            }
            placeholder="Select persona"
            sx={{
              bgcolor: "var(--joy-palette-background-level1)",
              "&:hover": { bgcolor: "var(--joy-palette-background-level1)" },
            }}
          >
            {reasons.map((reason, index) => (
              <Option key={index} value={reason}>
                {reason}
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
            sx={{
              borderRadius: "6px",
              fontSize: "14px",
              color: "var(--joy-palette-text-primary)",
              "&::placeholder": {
                color: "var(--joy-palette-text-secondary)",
              },
            }}
          />

          <Stack spacing={1} sx={{ mt: 1}}>
            {emails.map((email, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1, color: "var(--joy-palette-text-primary)" }}
              >
                <Typography sx={{ color: "var(--joy-palette-text-primary)", fontSize: '16px' }}>{email}</Typography>

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

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handleConfirm}
              sx={{
                borderRadius: "20px",
                bgcolor: "#4F46E5",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "#4338CA" },
                padding: "8px 24px",
                minWidth: "140px",
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
