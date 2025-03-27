import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

interface DeleteDeactivateUserModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  usersToDelete?: string[];
  isDeactivate?: boolean;
}

export default function DeleteDeactivateUserModal({
  open,
  onClose,
  onConfirm,
  usersToDelete,
  isDeactivate = false,
}: DeleteDeactivateUserModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ maxWidth: 520, borderRadius: "8px", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography level="h3">
            {isDeactivate ? "Deactivate users?" : "Delete users?"}
          </Typography>
          <Button variant="plain" onClick={onClose} sx={{ p: 0, minWidth: 0 }}>
            <XIcon fontSize="var(--Icon-fontSize)" />
          </Button>
        </Box>
        <Typography level="body-md" sx={{ mt: 2, color: "#636B74" }}>
          <Typography component="span" sx={{ color: 'var(--joy-palette-text-primary)' }}>
            {usersToDelete?.join(", ")}
          </Typography>{" "}
          {isDeactivate
            ? "will lose access to their accounts but their data will remain. You can reactivate them later"
            : "will be permanently removed along with all their data"}
          .{!isDeactivate && " This action cannot be undone."}
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: "20px",
              borderColor: "#E5E7EB",
              color: "#000000",
              padding: "8px 16px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={onConfirm}
            sx={{
              borderRadius: "20px",
              bgcolor: isDeactivate ? "#4F46E5" : "#EF4444",
              color: "#FFFFFF",
              padding: "8px 16px",
              "&:hover": {
                bgcolor: isDeactivate ? "#4338CA" : "#DC2626",
              },
            }}
          >
            {isDeactivate ? "Deactivate" : "Delete permanently"}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}