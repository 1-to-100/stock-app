import * as React from "react";
import { useState, useEffect } from "react";
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
import { Upload as UploadIcon } from "@phosphor-icons/react/dist/ssr/Upload";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Trash as Trash } from "@phosphor-icons/react/dist/ssr/Trash";
import { WarningCircle as WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Box } from "@mui/joy";
import { useColorScheme } from '@mui/joy/styles';

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
  user?: User;
  onSave: (updatedUser: User) => void;
}

export default function AddEditUser({
  open,
  onClose,
  user,
  onSave,
}: AddEditUserProps) {
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const { colorScheme } = useColorScheme();
  const isLightTheme = colorScheme === 'light'  

  useEffect(() => {
    if (user && open) {
      const nameParts = user.name.split(" ");
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email:
          typeof user.email === "string" ? user.email : user.email[0] || "",
        customer: user.customer || "",
        role: user.role || "",
        persona: user.persona || "",
        manager: "",
      });
      setAdditionalEmails(
        Array.isArray(user.email) ? user.email.slice(1).filter(Boolean) : []
      );
      setAvatarPreview(user.avatar || null);
      setIsActive(user.status === "active");
    } else if (!user && open) {
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
    }
  }, [user, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEmail = () => {
    if (additionalEmails.length < 2) {
      setAdditionalEmails([...additionalEmails, ""]);
    }
  };

  const handleAdditionalEmailChange = (index: number, value: string) => {
    const updatedEmails = [...additionalEmails];
    updatedEmails[index] = value;
    setAdditionalEmails(updatedEmails);
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

  const handleSave = () => {
    const updatedUser: User = {
      id: user?.id || Date.now(),
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: [
        formData.email,
        ...additionalEmails.filter((email) => email.trim() !== ""),
      ].filter(Boolean),
      customer: formData.customer,
      role: formData.role,
      persona: formData.persona,
      status: isActive ? "active" : "inactive",
      avatar: avatarPreview || undefined,
    };
    onSave(updatedUser);
    onClose();
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
          {user ? "Edit user" : "Add user"}
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
                  bgcolor: isLightTheme ? "#DDDEE0" : 'transparent',
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

          {user && (
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
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": { color: "var(--joy-palette-text-secondary)" },
                }}
              />
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
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": { color: "var(--joy-palette-text-secondary)" },
                }}
              />
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
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": { color: "var(--joy-palette-text-secondary)" },
                }}
              />
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
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": { color: "var(--joy-palette-text-secondary)" },
                }}
              >
                <Option value="StockHive">StockHive</Option>
                <Option value="TradeNest">TradeNest</Option>
                <Option value="MarketSphere">MarketSphere</Option>
                <Option value="InvestHorizon">InvestHorizon</Option>
                <Option value="EquityVault">EquityVault</Option>
                <Option value="StockAnchor">StockAnchor</Option>
                <Option value="BullBear Hub">BullBear Hub</Option>
                <Option value="MarketPulse">MarketPulse</Option>
              </Select>
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
                sx={{
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": { color: "var(--joy-palette-text-secondary)" },
                }}
              />
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
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": { color: "var(--joy-palette-text-secondary)" },
                }}
              >
                <Option value="Customer admin">Customer admin</Option>
                <Option value="User">User</Option>
              </Select>
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
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": { color: "var(--joy-palette-text-secondary)" },
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
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "var(--joy-palette-text-primary)",
                  "&::placeholder": { color: "var(--joy-palette-text-secondary)" },
                }}
              >
                <Option value="">None</Option>
              </Select>
            </Stack>
            <Stack sx={{ flex: 1 }}></Stack>
          </Stack>

          <Button
            variant="plain"
            startDecorator={<PlusIcon fontSize="16px" />}
            onClick={handleAddEmail}
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
            <Button
              variant="outlined"
              onClick={onClose}
            >
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
              Save
            </Button>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
