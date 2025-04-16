import { apiFetch } from "./api-fetch";

export interface Role {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRoles(): Promise<Role[]> {
  return apiFetch<Role[]>(`${API_URL}/roles`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });
}