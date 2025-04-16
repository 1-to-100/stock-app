import { apiFetch } from "./api-fetch";

export interface SystemModules {
    name: string;
    label: string;
    enabled: boolean;
    permissions: {
      name: string;
      label: string;
      order: number;
    }[];
  }

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getSystemModules(): Promise<SystemModules[]> {
  return apiFetch<SystemModules[]>(`${API_URL}/system-modules`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });
}