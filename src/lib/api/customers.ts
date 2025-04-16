import { apiFetch } from "./api-fetch";

export interface Customer {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>(`${API_URL}/customers`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });
}