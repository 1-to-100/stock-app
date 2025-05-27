import {apiFetch} from "@/lib/api/api-fetch";
import {config} from "@/config";

export async function unreadNotificationsCount(): Promise<{count: number}> {
  return apiFetch<{count: number}>(`${config.site.apiUrl}/notifications/unread-count`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });
}