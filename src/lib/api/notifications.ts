import {apiFetch} from "@/lib/api/api-fetch";
import {config} from "@/config";
import { ApiNotification } from "@/contexts/auth/types";

export interface GetNotificationsParams {
  page?: number;
  perPage?: number;
  isRead?: boolean;
  type?: string;
}

export interface GetNotificationsResponse {
  data: ApiNotification[]; 
  meta: {
    total: number;
    page: number;
    lastPage: number;
    perPage: number;
    currentPage: number;
    prev: number | null;
    next: number | null;
  };
}

export async function unreadNotificationsCount(): Promise<{count: number}> {
  return apiFetch<{count: number}>(`${config.site.apiUrl}/notifications/unread-count`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });
}

export async function getNotifications(params: GetNotificationsParams = {}): Promise<GetNotificationsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.perPage) query.set('perPage', params.perPage.toString());
  if (params.isRead) query.set('isRead', params.isRead.toString());
  if (params.type) query.set('type', params.type);
  
  return apiFetch<GetNotificationsResponse>(`${config.site.apiUrl}/notifications?${query.toString()}`, {
    method: 'GET',
  });
}

export async function markNotificationAsRead(id: number): Promise<void> {
  return apiFetch<void>(`${config.site.apiUrl}/notifications/${id}`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  return apiFetch<void>(`${config.site.apiUrl}/notifications/read-all`, {
    method: 'PATCH',
  });
}