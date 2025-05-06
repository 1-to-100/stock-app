"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { logger } from "@/lib/default-logger";
import { toast } from "@/components/core/toaster";
import { IconButton } from "@mui/joy";
import { Upload as UploadIcon } from "@phosphor-icons/react/dist/ssr/Upload";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import { useUserInfo } from '@/hooks/use-user-info';

const schema = zod.object({
  avatar: zod.string().optional(),
  firstName: zod
    .string()
    .min(1, { message: "First name is required" })
    .max(255),
  lastName: zod.string().min(1, { message: "Last name is required" }).max(255),
  email: zod.string().min(1, { message: "Email is required" }).email(),
  phone: zod
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" }),
  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type Values = zod.infer<typeof schema>;

export function UpdateProfileForm(): React.JSX.Element {
  const { userInfo } = useUserInfo();

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({
    defaultValues: {
      avatar: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

 
  React.useEffect(() => {
    if (userInfo) {
      reset({
        avatar: userInfo.avatar || "",
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: typeof userInfo.phone === "string" ? userInfo.phone : "",
        password: "",
      });
    }
  }, [userInfo, reset]);

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const onSubmit = React.useCallback(async (_: Values): Promise<void> => {
    try {
      toast.success("Details updated");
    } catch (err) {
      logger.error(err);
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Controller
              control={control}
              name="avatar"
              render={({ field }) => (
                <Box sx={{ "--Avatar-size": "120px", position: "relative" }}>
                  <Box
                    display="flex"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={{ xs: 1, sm: 2 }}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    {field.value ? (
                      <Avatar
                        src={field.value}
                        sx={{
                          width: { xs: 48, sm: 64 },
                          height: { xs: 48, sm: 64 },
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <IconButton
                        component="label"
                        sx={{
                          bgcolor: "#E5E7EB",
                          borderRadius: "50%",
                          width: { xs: 48, sm: 64 },
                          height: { xs: 48, sm: 64 },
                          color: "#4F46E5",
                        }}
                      >
                        <UploadIcon style={{ fontSize: "16px" }} />
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/gif"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                field.onChange(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </IconButton>
                    )}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        level="body-sm"
                        sx={{
                          fontSize: { xs: "12px", sm: "14px" },
                          fontWeight: 500,
                          color: "var(--joy-palette-text-primary)",
                          lineHeight: "16px",
                          textAlign: { xs: "left", sm: "left" },
                        }}
                      >
                        Upload Avatar
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "10px", sm: "12px" },
                          fontWeight: 400,
                          color: "var(--joy-palette-text-secondary)",
                          lineHeight: "16px",
                          textAlign: { xs: "left", sm: "left" },
                        }}
                      >
                        We support PNGs, JPEGs, and GIFs under 3MB
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            />
          </Stack>
          <Divider sx={{ maxWidth: "512px" }} />
          <Stack spacing={2}>
            <Typography sx={{ fontSize: "14px", fontWeight: 300 }}>
              General info
            </Typography>
            <Box sx={{ maxWidth: "512px" }}>
              <Stack
                flexDirection={{ px: "column", sm: "row" }}
                spacing={3}
                sx={{ mb: 3 }}
              >
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <FormControl
                      error={Boolean(errors.firstName)}
                      sx={{ flex: 1 }}
                    >
                      <FormLabel>First Name</FormLabel>
                      <Input {...field} />
                      {errors.firstName ? (
                        <FormHelperText>
                          {errors.firstName.message}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <FormControl
                      error={Boolean(errors.lastName)}
                      sx={{ flex: 1 }}
                    >
                      <FormLabel>Last Name</FormLabel>
                      <Input {...field} />
                      {errors.lastName ? (
                        <FormHelperText>
                          {errors.lastName.message}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
              </Stack>
              <Stack spacing={3}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.email)}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        {...field}
                        type="email"
                        sx={{ maxWidth: "512px" }}
                      />
                      {errors.email ? (
                        <FormHelperText>{errors.email.message}</FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.phone)}>
                      <FormLabel>Phone number</FormLabel>
                      <Input {...field} type="tel" sx={{ maxWidth: "512px" }} />
                      {errors.phone ? (
                        <FormHelperText>{errors.phone.message}</FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ maxWidth: "512px" }} />

          <Stack spacing={2}>
            <Typography sx={{ fontSize: "14px", fontWeight: 300 }}>
              Security
            </Typography>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl
                  error={Boolean(errors.password)}
                  sx={{ maxWidth: "512px" }}
                >
                  <FormLabel>Password</FormLabel>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Input
                      {...field}
                      sx={{ width: "100%", maxWidth: "360px" }}
                      type={showPassword ? "text" : "password"}
                      endDecorator={
                        <IconButton
                          onClick={(): void => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <EyeSlashIcon
                              fontSize="var(--Icon-fontSize)"
                              weight="bold"
                            />
                          ) : (
                            <EyeIcon
                              fontSize="var(--Icon-fontSize)"
                              weight="bold"
                            />
                          )}
                        </IconButton>
                      }
                    />
                    <Box
                      sx={{
                        color: "#3D37DD",
                        fontSize: "14px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Change password
                    </Box>
                  </Box>
                  {errors.password ? (
                    <FormHelperText>{errors.password.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              top: { xs: "97px", lg: "120px" },
              right: { xs: "20px", lg: "50px" },
              position: "fixed",
            }}
          >
            <Button
              onClick={() => {
                reset();
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </Stack>
        </Stack>
      </form>
      <ChangePasswordModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
