import { apiFetch } from "./api-fetch";

export interface Manager {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getManagers(): Promise<Manager[]> {
  return apiFetch<Manager[]>(`${API_URL}/managers`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });
}