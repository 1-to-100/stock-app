"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Popup, PopupContent } from "@/components/core/popup";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  GetNotificationsResponse,
} from "@/lib/api/notifications";
import { ApiNotification } from "@/contexts/auth/types";
import { Info, Article } from "@phosphor-icons/react/dist/ssr";
import CircularProgress from "@mui/joy/CircularProgress";

export interface NotificationsPopoverProps {
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
  open: boolean;
}

export function NotificationsPopover({
  anchorEl,
  onClose,
  open,
}: NotificationsPopoverProps): React.JSX.Element {
  const queryClient = useQueryClient();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: ({ pageParam = 1 }) =>
        getNotifications({ isRead: false, type: "IN_APP", page: pageParam }),
      getNextPageParam: (lastPage: GetNotificationsResponse) =>
        lastPage.meta.next,
      initialPageParam: 1,
    });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(
        ["notifications"],
        (old: GetNotificationsResponse | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((n: ApiNotification) => ({
              ...n,
              isRead: true,
            })),
          };
        }
      );

      return { previousNotifications };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = React.useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data]
  );

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      if (scrollBottom < 100 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return (
    <Popup
      anchorEl={anchorEl}
      onClose={onClose}
      open={open}
      placement="bottom-end"
      sx={{
        maxWidth: "500px",
        width: "100%",
      }}
    >
      <PopupContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 1,
            }}
          >
            <Typography level="h4">Notifications</Typography>
            <Button
              size="sm"
              variant="outlined"
              onClick={() => markAllAsRead()}
              disabled={notifications.length === 0}
            >
              Mark as read
            </Button>
          </Stack>
          {isLoading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 2 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack
                ref={containerRef}
                onScroll={handleScroll}
                sx={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "var(--joy-palette-neutral-300)",
                    borderRadius: "4px",
                  },
                }}
              >
                {notifications.map(
                  (notification: ApiNotification): React.JSX.Element => (
                    <Stack
                      direction="row"
                      key={notification.id}
                      spacing={2}
                      sx={{ p: 0, mb: 2 }}
                    >
                      <NotificationContent notification={notification} />
                    </Stack>
                  )
                )}
                {isFetchingNextPage && (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ py: 2 }}
                  >
                    <CircularProgress size="sm" />
                  </Stack>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </PopupContent>
    </Popup>
  );
}

interface NotificationContentProps {
  notification: ApiNotification;
}

function NotificationContent({
  notification,
}: NotificationContentProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const { mutate: markAsRead } = useMutation({
    mutationFn: () => markNotificationAsRead(notification.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(
        ["notifications"],
        (old: GetNotificationsResponse | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((n: ApiNotification) =>
              n.id === notification.id ? { ...n, isRead: true } : n
            ),
          };
        }
      );

      return { previousNotifications };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack
        sx={{
          backgroundColor:
            notification?.channel === "info"
              ? "#EEEFF0"
              : notification?.channel === "article"
              ? "#EEEFF0"
              : notification?.channel === "warning"
              ? "#FFF8C5"
              : notification?.channel === "alert"
              ? "#FFE9E8"
              : "#4F46E5",
          borderRadius: "50%",
          p: 0.7,
        }}
      >
        <Info
          size={24}
          style={{
            display: notification?.channel === "article" ? "none" : "block",
          }}
          color={
            notification?.channel === "info"
              ? "#6B7280"
              : notification?.channel === "article"
              ? "#6B7280"
              : notification?.channel === "warning"
              ? "#b74c06"
              : notification?.channel === "alert"
              ? "#D3232F"
              : "#4F46E5"
          }
        />
        <Article
          size={24}
          style={{
            display: notification?.channel === "article" ? "block" : "none",
          }}
          color="#6B7280"
        />
      </Stack>
      <Stack direction="column">
        <Typography
          fontSize="15px"
          fontWeight="lg"
          sx={{ fontWeight: "500", color: "var(--joy-palette-text-primary)" }}
        >
          {notification.title}
        </Typography>
        <Typography
          fontSize="12px"
          sx={{ fontWeight: "400", color: "var(--joy-palette-text-secondary)" }}
        >
          {notification.message}
        </Typography>
      </Stack>

      {!notification.isRead ? (
        <Button
          variant="solid"
          onClick={() => markAsRead()}
          sx={{
            borderRadius: "50%",
            flexGrow: 0,
            flexShrink: 0,
            height: "5px",
            mt: "3px",
            width: "5px",
            p: "5px",
            minHeight: "5px",
          }}
        />
      ) : null}
    </Stack>
  );
}
